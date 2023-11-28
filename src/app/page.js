"use client";
import Image from "next/image";
import styles from "./page.module.css";
import HomePage from "../Components/Home/Home";
import { useState } from "react";
export default function Home() {
  const [openProfile, setOpenProfile] = useState(true);

  return (
    <main className={styles.main}>
      <HomePage openProfile={openProfile} setOpenProfile={setOpenProfile} />
    </main>
  );
}
