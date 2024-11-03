import { ContentContainer } from "@/components/Containers";
import "../styles/not-found.css";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <ContentContainer className="not-found-container">
      <h1 className="not-found-title">404 Not Found!</h1>
      <Link href="/">
        Go Back To Homepage
      </Link>
    </ContentContainer>
  );
}

