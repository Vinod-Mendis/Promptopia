"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Import useSearchParams
import Form from "@components/Form";

const EditPrompt = () => {
  const router = useRouter();
  const [promptId, setPromptId] = useState(null); // State to hold promptId
  const [loading, setLoading] = useState(true); // State to manage loading state
  const searchParams = useSearchParams();

  useEffect(() => {
    setPromptId(searchParams.get("id")); // Set promptId when searchParams change
    setLoading(false); // Set loading to false once promptId is set
  }, [searchParams]);

  // Return loading indicator while fetching promptId
  if (loading) {
    return <div>Loading...</div>;
  }

  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState({
    prompt: "",
    tag: "",
  });

  useEffect(() => {
    const getPromptDetails = async () => {
      const response = await fetch(`api/prompt/${promptId}`);
      const data = await response.json();

      setPost({
        prompt: data.prompt,
        tag: data.tag,
      });
    };

    if (promptId) getPromptDetails();
  }, [promptId]);

  const updatePrompt = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!promptId) return alert("Prompt ID not found");

    try {
      const response = await fetch(`/api/prompt/${promptId}`, {
        method: "PATCH",
        body: JSON.stringify({
          prompt: post.prompt,
          tag: post.tag,
        }),
      });

      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form
      type="Edit"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={updatePrompt}
    />
  );
};

// Wrap EditPrompt in Suspense
const EditPromptWithSuspense = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <EditPrompt />
  </Suspense>
);

export default EditPromptWithSuspense;
