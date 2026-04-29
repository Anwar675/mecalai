"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PricingCard } from "./pricing-crad";

export const UpgradeView = () => {
  const trpc = useTRPC();
  const { data: products } = useSuspenseQuery(
    trpc.premium.getProducts.queryOptions(),
  );
  const { data: currentSubscription } = useSuspenseQuery(
    trpc.premium.getCurrentSubscription.queryOptions(),
  );
  const highlighted = products.find(
    (p) => p.metadata.variant === "highlighted",
  );

  const others = products.filter((p) => p.metadata.variant !== "highlighted");

  const sortedProducts = highlighted
    ? [others[0], highlighted, others[1]]
    : products;

  console.log(sortedProducts);

  return (
    <div className="flex-1 py-4 px-4 md:px-8 md:py-4 flex flex-col gap-y-10">
      <div className="mt-4 flex-1 flex flex-col gap-y-10  items-center ">
        <h5 className="font-medium text-2xl md:text-3xl">
          You are on the {""}
          <span className="font-bold text-custom">
            {currentSubscription?.name ?? "Free"} {""}
          </span>
          plan
        </h5>
        <div className="grid grid-col-1 md:grid-cols-3 gap-4">
          {sortedProducts.map((product) => {
            const isCurrentProduct = currentSubscription?.id === product.id;
            const isPremium = !!currentSubscription;
            let buttonText = "Upgrade";
            let onClick = () => authClient.checkout({ products: [product.id] });
            if (isCurrentProduct) {
              buttonText = "Manage";
              onClick = () => authClient.customer.portal();
            } else if (isPremium) {
              buttonText = "Change Plan";
              onClick = () => authClient.customer.portal();
            }
            return (
              <PricingCard
                key={product.id}
                buttonText={buttonText}
                onClick={onClick}
                variant={
                  product.metadata.variant === "highlighted"
                    ? "highlighted"
                    : "default"
                }
                title={product.name}
                price={
                  product.prices[0].amountType === "fixed"
                    ? product.prices[0].priceAmount / 100
                    : 0
                }
                priceSuffix={`/${product.recurringInterval}`}
                descriptions={product.description}
                features={product.benefits.map(
                  (benefit) => benefit.description,
                )}
                badge={product.metadata.badge as string | null}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const UpgradeViewLoading = () => {
  return (
    <LoadingState title="loading" description="This may take a few seconds" />
  );
};

export const UpgradeViewError = () => {
  return <ErrorState title="Error" description="Please try again" />;
};
