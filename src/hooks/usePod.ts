import { Pod, PodResponseData, QueryResponse } from "../types";

import axios from "axios";
import { getUserSessionId } from "../utils/cookieUtils";

const API_BASE_URL = "https://api.videoindex.app";

export const getPods = async (): Promise<Pod[]> => {
  const response = await axios.get<Pod[]>(
    `https://api.videoindex.app/knowledge-bases`,
    {
      headers: {
        "X-Session-Token": getUserSessionId(),
      },
    }
  );
  console.log("Pods fetched: ", response.data);
  return response.data;
};

export const getPodById = async (id: string): Promise<PodResponseData> => {
  try {
    const response = await axios.get<PodResponseData>(
      `${API_BASE_URL}/knowledge-bases/${id}`,
      {
        headers: {
          "X-Session-Token": getUserSessionId(),
        },
      }
    );
    console.log("Pod fetched: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching pod by ID:", error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("Pod not found");
      }
      throw new Error(
        `Failed to fetch pod: ${error.response?.statusText || error.message}`
      );
    }
    throw new Error("Failed to fetch pod");
  }
};

export const queryPodStreaming = async (
  knowledge_base_id: string,
  query: string,
  onChunk: (chunk: QueryResponse) => void,
  max_results: number = 5
): Promise<void> => {
  console.log(
    "Streaming query for pod with ID:",
    knowledge_base_id,
    "and query:",
    query
  );

  const response = await fetch(`${API_BASE_URL}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Session-Token": getUserSessionId(),
    },
    body: JSON.stringify({
      knowledge_base_id: Number(knowledge_base_id),
      query,
      max_results,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("No response body reader available");
  }

  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      // Decode the chunk and add to buffer
      buffer += decoder.decode(value, { stream: true });

      // Process complete lines (JSON objects separated by newlines)
      const lines = buffer.split("\n");

      // Keep the last incomplete line in the buffer
      buffer = lines.pop() || "";

      // Process each complete line
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine) {
          try {
            const chunk = JSON.parse(trimmedLine) as QueryResponse;
            console.log("Received streaming chunk:", chunk);
            onChunk(chunk);
          } catch (parseError) {
            console.warn(
              "Failed to parse JSON chunk:",
              trimmedLine,
              parseError
            );
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
};

export const queryPod = async (
  knowledge_base_id: string,
  query: string,
  max_results: number = 5
): Promise<QueryResponse> => {
  console.log("Querying pod with ID:", knowledge_base_id, "and query:", query);
  const response = await axios.post<QueryResponse>(
    `${API_BASE_URL}/query`,
    {
      knowledge_base_id: Number(knowledge_base_id),
      query,
      max_results,
    },
    {
      headers: {
        "X-Session-Token": getUserSessionId(),
      },
    }
  );
  console.log("Pod query result: ", response.data);
  return response.data;
};

export const submitQueryFeedback = async (feedbackData: {
  knowledge_base_id: number;
  query: string;
  response: string;
  thumbs_up: boolean;
  comments?: string;
}): Promise<{ success: boolean }> => {
  console.log("Submitting feedback with data:", feedbackData);
  const response = await axios.post(
    `${API_BASE_URL}/query-feedback`,
    feedbackData,
    {
      headers: {
        "X-Session-Token": getUserSessionId(),
      },
    }
  );
  console.log("Feedback submission result: ", response.data);
  return { success: response.data.success };
};

export const feedback = async (feedbackData: {
  name: string;
  email: string;
  rating: number;
  category: string;
  comments: string;
}): Promise<{ success: boolean }> => {
  console.log("Submitting feedback with data:", feedbackData);
  const response = await axios.post(`${API_BASE_URL}/feedback`, feedbackData, {
    headers: {
      "X-Session-Token": getUserSessionId(),
    },
  });
  console.log("Feedback submission result: ", response.data);
  return { success: response.data.success };
};

export const getUsage = async (): Promise<
  Record<string, { queries: number; views: number }>
> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/usage`, {
      headers: {
        "X-Session-Token": getUserSessionId(),
      },
    });

    const usageData: Record<string, { queries: number; views: number }> = {};
    for (const [key, value] of Object.entries(response.data.usage)) {
      if (key.startsWith("pod_")) {
        usageData[key] = {
          queries: (value as any).queries || 0,
          views: (value as any).views || 0,
        };
      }
    }

    return usageData;
  } catch (error) {
    console.error("Error fetching usage data:", error);
    throw new Error("Failed to fetch usage data");
  }
};

export const createPod = async (podData: {
  title: string;
  video_urls: string[];
}): Promise<PodResponseData> => {
  console.log("Creating pod with data:", podData);
  const response = await axios.post<PodResponseData>(
    `${API_BASE_URL}/upload`,
    podData,
    {
      headers: {
        "X-Session-Token": getUserSessionId(),
      },
    }
  );
  console.log("Pod creation result: ", response.data);
  return {
    ...response.data,
    status: response.data.status?.trim().toLowerCase(),
  };
};
