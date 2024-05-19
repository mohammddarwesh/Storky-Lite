import { useEffect, useState } from "react";
import { Content, Session } from "@/types/interface";
import { useSession } from "next-auth/react";
import GetContent from "@/actions/getContent";
import GalleryTab from "@/components/gallery/gallery-tab";

interface GetContentProps {
  courseId: string;
  sessionId: string;
}
export default function ContentProvider({
  courseId,
  sessionId,
}: GetContentProps) {
  const { data: session, status } = useSession();
  //   const [content, setContent] = useState<Content[]>([]);
  const { content, isLoading } = GetContent({ courseId, sessionId });
  console.log("content", content);
  useEffect(() => {
    if (status === "authenticated" && session && session.user.token) {
      // Fetch content here if needed
    }
  }, [status, session, session?.user.token]);

  return (
    <>
      {content &&
        content.map((item) => (
          <GalleryTab key={item.id} url={item.url} type={item.type} />
        ))}
    </>
  );
}
