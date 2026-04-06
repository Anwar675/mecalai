"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { useState } from "react"

const Page = () => {
  const [name, setName]= useState("")
  const [email, setEmail]= useState("")
  const [password, setPassword]= useState("")
  const onSubmit = () => {
    authClient.signUp.email({
      email,
      password,
      name
    }, {
      onError: () => {
        window.alert("Error signing up")
      },
      onSuccess: () => console.log("I love you ")
    })
  }
  return (
    <div className="flex flex-col gap-5">
      <div>
        <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <Button onClick={onSubmit}>Submit</Button>
    </div>
  )
}

export default Page