"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useEffect, useState } from "react";
import Loading from "@/app/loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import DragonComponent from "@/components/dragon";
import { xpToLevel } from "@/lib/progression";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type DecisionResult, evaluateDecision } from "@/lib/player-decision";

//import { textToColor } from "@/lib/profile";

/*
  did u know
  llms fail at parsing ascii text as well
                              _
                             (_)
         ___  __ _ _ __ _ __  _ _ __  _   _  ___
        / __|/ _` | '__| '_ \| | '_ \| | | |/ _ \
        \__ \ (_| | |  | |_) | | | | | |_| | (_) |
        |___/\__,_|_|  | .__/|_|_| |_|\__, |\___/
                       | |             __/ |
                       |_|            |___/

*/

export interface UserProfile {
  user_id: string;
  name: string;
  class: string;
  total_xp: number;
  coins: number;
  fights_left: number;
}
interface ClassLeaderboardRow {
  class: string;
  t_xp: number;
}
export interface Task {
  id: string;
  name: string;
  proof_type: string;
  xp: number;
  desc: string;
  active: boolean;
}
export default function Page() {
  const [me, setMe] = useState<UserProfile | null>(null);
  const [myClass, setMyClass] = useState<UserProfile[] | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [decision, setDecision] = useState<DecisionResult | null>(null);
  const [globalLeaders, setGlobalLeaders] = useState<UserProfile[] | null>(
    null,
  );
  const [classLeaders, setClassLeaders] = useState<
    ClassLeaderboardRow[] | null
  >(null);
  useEffect(() => {
    const loadMe = async () => {
      const res = await fetch("/api/info");
      if (res.status === 599) {
        window.location.href = "/auth/sign-up-success";
        return;
      }
      if (!res.ok) toast.error("Bir hata oluştu");

      const json = await res.json();
      setMe(json.data);
    };

    loadMe();
  }, []);

  const fetchClass = async () => {
    if (!me) throw new Error("User not loaded yet");
    const res = await fetch("/api/class", {
      method: "POST",
      //next: { revalidate: 60 },
      body: JSON.stringify({ wantedClass: me.class }),
    });
    if (!res.ok) throw new Error("Failed to fetch class data");

    const json = await res.json();
    setMyClass(json.data);
  };

  const fetchTasks = async () => {
    if (!me) throw new Error("User not loaded yet");
    const res = await fetch("/api/task", {
      method: "GET",
      cache: "force-cache",
    });
    if (!res.ok) throw new Error("Failed to fetch class data");

    const json = await res.json();
    setTasks(json);
    setSelectedTask((prev) => {
      if (prev) {
        return (
          json.find((item: Task) => item.id === prev.id) ?? json[0] ?? null
        );
      }
      return json[0] ?? null;
    });
  };
  const fetchGlobalLeaders = async () => {
    setGlobalLeaders(null);
    const res = await fetch("/api/leaderboard", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch leaderboard");
    const json = await res.json();
    setGlobalLeaders(json.data ?? json);
  };
  const fetchClassLeaders = async () => {
    if (!me) throw new Error("User not loaded yet");
    setClassLeaders(null);
    const res = await fetch("/api/classboard", {
      method: "POST",
      cache: "no-store",
      body: JSON.stringify({ wantedClass: me.class }),
    });
    if (!res.ok) throw new Error("Failed to fetch classboard");
    const json = await res.json();
    setClassLeaders(json.data ?? json);
  };
  useEffect(() => {
    if (!me || !selectedTask) {
      setDecision(null);
      return;
    }
    try {
      const result = evaluateDecision(
        {
          id: me.user_id,
          level: xpToLevel(me.total_xp),
          skill: Math.max(1, xpToLevel(me.total_xp) * 10),
          habitScore: me.fights_left,
        },
        {
          id: selectedTask.id,
          reward: selectedTask.xp,
          difficulty: Math.max(1, selectedTask.xp / 2),
        },
      );
      setDecision(result);
    } catch (err) {
      console.warn("decision model failed", err);
      setDecision(null);
    }
  }, [me, selectedTask]);
  //const filteredTasks = tasks.filter((task) => mapTaskToTab(task) === taskTab);

  /*useEffect(() => {
    const belongs = selectedTask && mapTaskToTab(selectedTask) === taskTab;
    if (!selectedTask || !belongs) {
      const fallback =
        tasks.find((task) => mapTaskToTab(task) === taskTab) || null;
      if (fallback !== selectedTask) {
        setSelectedTask(fallback);
      }
    }
  }, [taskTab, tasks, selectedTask]);*/

  if (!me) {
    return <Loading />; // fake suspense
  }

  return (
    <div className="flex flex-col p-3 justify-between h-screen w-screen bg-gradient-to-b bg-linear-to-r from-lime-700 via-emerald-400 to-emerald-600 ">
      <div className="flex flex-row gap-2 w-full justify-between" id="header">
        <div className="flex flex-row gap-2 items-center">
          <Avatar>
            <AvatarImage alt={me.name} />
            <AvatarFallback style={{ backgroundColor: textToColor(me.name) }}>
              {me.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h2 className="dark:text-white">{me.name}</h2>
          <Badge
            variant="default"
            className="h-5 min-w-5 rounded-full px-1 text-center bg-blue-500"
          >
            {xpToLevel(me.total_xp)}
          </Badge>
        </div>
        <Badge
          variant="default"
          className="h-6 min-w-6 rounded-full px-1 text-center bg-green-500"
        >
          {me.coins}
        </Badge>
      </div>
      <div
        className="flex-grow flex items-center justify-center"
        id="middle-shit"
      >
        <DragonComponent {...me} />
      </div>
      <div
        id="footer"
        className="flex h-16 w-full justify-center items-stretch mb-3 text-center"
      >
        <Button className="h-full flex-1" asChild>
          <Link href="/savas">Savaş</Link>
        </Button>
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              onClick={() => fetchClass()}
              className="h-full flex-1"
            >
              Klan
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle className="text-xl">Klanın</DrawerTitle>
              </DrawerHeader>

              <ScrollArea className=" w-full h-92 mb-8  rounded-md border">
                <div className="p-4">
                  <React.Fragment key={me.user_id}>
                    {myClass !== null ? (
                      <div className="flex flex-row text-center items-center align-center gap-2">
                        <Avatar>
                          <AvatarImage alt={me.name} />
                          <AvatarFallback
                            style={{
                              backgroundColor: textToColor(me.name),
                            }}
                          >
                            {me.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <h2
                          className={cn(
                            "text-sm dark:text-white",
                            me.user_id === me.user_id ? "bold" : "",
                          )}
                        >
                          {me.name}
                        </h2>
                        <Badge
                          variant="default"
                          className="h-5 min-w-5 rounded-full px-1 text-center bg-blue-500"
                        >
                          {xpToLevel(me.total_xp)}
                        </Badge>
                        <Badge
                          variant="default"
                          className="h-6 min-w-6 rounded-full px-1 text-center bg-green-500"
                        >
                          {me.coins}
                        </Badge>
                      </div>
                    ) : (
                      <></>
                    )}
                  </React.Fragment>
                  {myClass ? (
                    myClass.map((user) =>
                      user.user_id !== me.user_id ? (
                        <React.Fragment key={user.user_id}>
                          <Separator className="my-2" />
                          <div className="flex flex-row text-center items-center align-center gap-2">
                            <Avatar>
                              <AvatarImage alt={user.name} />
                              <AvatarFallback
                                style={{
                                  backgroundColor: textToColor(user.name),
                                }}
                              >
                                {user.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <h2
                              className={cn(
                                "text-sm dark:text-white",
                                user.user_id === me.user_id ? "bold" : "",
                              )}
                            >
                              {user.name}
                            </h2>
                            <Badge
                              variant="default"
                              className="h-5 min-w-5 rounded-full px-1 text-center bg-blue-500"
                            >
                              {xpToLevel(user.total_xp)}
                            </Badge>
                            <Badge
                              variant="default"
                              className="h-6 min-w-6 rounded-full px-1 text-center bg-green-500"
                            >
                              {user.coins}
                            </Badge>
                          </div>
                        </React.Fragment>
                      ) : (
                        <React.Fragment
                          key={"emptyme" + user.user_id}
                        ></React.Fragment>
                      ),
                    )
                  ) : (
                    <>
                      <div className="flex flex-row text-center items-center align-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-6 w-[150px]" />
                      </div>
                      <Separator className="my-2" />
                      <div className="flex flex-row text-center items-center align-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-6 w-[175px]" />
                      </div>
                      <Separator className="my-2" />
                      <div className="flex flex-row text-center items-center align-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-6 w-[140px]" />
                      </div>
                      <Separator className="my-2" />
                    </>
                  )}
                </div>
              </ScrollArea>
            </div>
          </DrawerContent>
        </Drawer>
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              className="h-full flex-1"
              onClick={() => fetchTasks()}
            >
              Görev
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-md">
              <DrawerHeader>
                <DrawerTitle className="text-xl">Görevler</DrawerTitle>
              </DrawerHeader>
              <div className="grid gap-4 px-4 pb-6">
                <ScrollArea className="h-64 rounded-md border">
                  <div className="space-y-3 p-3">
                    {tasks.length ? (
                      tasks.map((task) => (
                        <button
                          key={task.id}
                          type="button"
                          onClick={() => setSelectedTask(task)}
                          className={cn(
                            "w-full rounded-xl border p-3 text-left transition",
                            selectedTask?.id === task.id
                              ? "border-primary bg-primary/5"
                              : "hover:border-primary/40",
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium dark:text-white">
                              {task.name}
                            </span>
                            <Badge variant="secondary">+{task.xp} XP</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {task.desc || "Kanıt fotoğrafı yükle."}
                          </p>
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Bu kategoriye ait görev yok.
                      </p>
                    )}
                  </div>
                </ScrollArea>
                <div className="rounded-lg border p-4 space-y-3">
                  {selectedTask ? (
                    <>
                      <div>
                        <p className="text-xs uppercase text-muted-foreground">
                          Seçilen görev
                        </p>
                        <p className="text-lg font-semibold dark:text-white">
                          {selectedTask.name}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {selectedTask.desc || "Kanıtını yükleyerek tamamla."}
                      </p>
                      {/*decision ? (
                        <div className="rounded-md border p-3 space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span>Başlama ihtimali</span>
                            <span className="font-semibold">
                              {Math.round(decision.probability * 100)}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-muted-foreground">
                            <span>Akış oranı</span>
                            <span>{decision.flowRatio.toFixed(2)}</span>
                          </div>
                          {decision.flowWarning ? (
                            <p className="text-amber-600 text-[11px]">
                              {decision.flowWarning}
                            </p>
                          ) : null}
                        </div>
                      ) : null*/}
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">+{selectedTask.xp} XP</Badge>
                        <Button asChild className="flex-1">
                          <Link href={`/upload?task_id=${selectedTask.id}`}>
                            Kanıt yükle
                          </Link>
                        </Button>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Bir görevi seç ve detayları gör.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>{" "}
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              className="h-full flex-1"
              onClick={() => {
                fetchGlobalLeaders();
                fetchClassLeaders();
              }}
            >
              Sıralama
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <Tabs className="w-full max-w-md px-8" defaultValue="global">
              <TabsList className="w-full justify-evenly  mt-4">
                <TabsTrigger value="global">Global</TabsTrigger>
                <TabsTrigger value="class">Sınıf</TabsTrigger>
              </TabsList>
              <TabsContent value="global">
                <div className="mx-auto w-full max-w-sm">
                  <ScrollArea className="w-full h-92 mb-8 rounded-md border">
                    <div className="p-4 space-y-2">
                      {globalLeaders ? (
                        globalLeaders.map((user, index) => (
                          <React.Fragment key={user.user_id}>
                            {index > 0 && <Separator className="my-2" />}
                            <div
                              className={cn(
                                "flex items-center gap-3",
                                user.user_id === me.user_id
                                  ? "font-semibold"
                                  : "",
                              )}
                            >
                              <Badge variant="secondary">{index + 1}</Badge>
                              <Avatar>
                                <AvatarImage alt={user.name} />
                                <AvatarFallback
                                  style={{
                                    backgroundColor: textToColor(user.name),
                                  }}
                                >
                                  {user.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col flex-1">
                                <span className="text-sm dark:text-white">
                                  {user.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {user.class}
                                </span>
                              </div>
                              <Badge
                                variant="default"
                                className="h-5 min-w-5 rounded-full px-1 text-center bg-blue-500"
                              >
                                {xpToLevel(user.total_xp)}
                              </Badge>
                              <Badge
                                variant="default"
                                className="h-6 min-w-6 rounded-full px-1 text-center bg-green-500"
                              >
                                {user.coins}
                              </Badge>
                            </div>
                          </React.Fragment>
                        ))
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="h-8 w-32" />
                          </div>
                          <Separator className="my-2" />
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="h-8 w-32" />
                          </div>
                        </>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>
              <TabsContent value="class">
                <div className="mx-auto w-full max-w-sm">
                  <ScrollArea className="w-full h-92 mb-8 rounded-md border">
                    <div className="p-4 space-y-2">
                      {classLeaders ? (
                        classLeaders.map((entry, index) => (
                          <React.Fragment key={entry.class}>
                            {index > 0 && <Separator className="my-2" />}
                            <div className="flex items-center gap-3">
                              <Badge variant="secondary">{index + 1}</Badge>
                              <Avatar>
                                <AvatarImage alt={entry.class} />
                                <AvatarFallback
                                  style={{
                                    backgroundColor: textToColor(entry.class),
                                  }}
                                >
                                  {entry.class.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col flex-1">
                                <span className="text-sm dark:text-white">
                                  {entry.class}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  Toplam XP
                                </span>
                              </div>
                              <Badge
                                variant="default"
                                className="h-5 min-w-5 rounded-full px-1 text-center bg-blue-500"
                              >
                                {entry.t_xp}
                              </Badge>
                            </div>
                          </React.Fragment>
                        ))
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="h-8 w-32" />
                          </div>
                          <Separator className="my-2" />
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="h-8 w-32" />
                          </div>
                        </>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>
            </Tabs>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
// shiiii i love saying shiiiii in my comments shiiiiiiiii
// shihihiihihihihiiii
function textToColor(text: string) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${(hash + 150) % 360}, 70%, 50%)`;
}

// shiiiii keep old imports working
export { textToColor } from "@/lib/profile";
export { xpToLevel } from "@/lib/progression";
