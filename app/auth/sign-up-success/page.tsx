"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { classes, cn } from "@/lib/utils";
import { toast } from "sonner";


export default function Page() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username.trim() || !value) {
      // was good but not ok for earthprize
      //toast.error("Pick a username and a class, dumbass");
      // i don't like this, but i gotta :(
      toast.error("Pick a username and a class, please.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", username.trim());
    formData.append("selected_class", value);

    const res = await fetch("/api/username", {
      method: "POST",
      body: formData,
    });

    setLoading(false);

    if (!res.ok) {
      toast.error("Something broke. Try again.");
      return;
    }

    // success → move on
    router.push("/"); // or wherever
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <form className="w-full max-w-sm" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Thank you for signing up!
              </CardTitle>
              <CardDescription>
                Earth awaits you, but one more step left.
              </CardDescription>
            </CardHeader>

            <CardContent className="gap-2 flex flex-col">
              <Label htmlFor="username">Select a username</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  @
                </span>
                <Input
                  id="username"
                  placeholder="johnDoe"
                  className="pl-6.5"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <Label>Select your class</Label>
              <Popover onOpenChange={setOpen} open={open}>
                <PopoverTrigger asChild>
                  <Button
                    aria-expanded={open}
                    className={cn(
                      "w-full justify-between",
                      value ? "" : "text-muted-foreground",
                    )}
                    role="combobox"
                    variant="outline"
                  >
                    {value
                      ? classes.find((c) => c.value === value)?.label
                      : "Select a class..."}
                    <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search classes..." />
                    <CommandList>
                      <CommandEmpty>No class found.</CommandEmpty>
                      <CommandGroup>
                        {classes.map((c) => (
                          <CommandItem
                            key={c.value}
                            value={c.value}
                            onSelect={(currentValue) => {
                              setValue(currentValue);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 size-4",
                                value === c.value ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {c.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Confirm"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
