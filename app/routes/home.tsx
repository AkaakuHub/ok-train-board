import { Welcome } from "~/welcome/welcome";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "OK-TRAIN 電光掲示板" },
    { name: "description", content: "Welcome to the 電光掲示板!" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: "OK-TRAIN 電光掲示板" },
    { name: "twitter:description", content: "Welcome to the 電光掲示板!" },
    { name: "twitter:image", content: "/images/ogp.webp" },
    { name: "og:title", content: "OK-TRAIN 電光掲示板" },
    { name: "og:description", content: "Welcome to the 電光掲示板!" },
    { name: "og:image", content: "/images/ogp.webp" },
    { name: "og:url", content: "/" },
    { name: "og:type", content: "website" },
    { name: "og:site_name", content: "OK-TRAIN 電光掲示板" },
  ];
}

export default function Home() {
  return <Welcome />;
}
