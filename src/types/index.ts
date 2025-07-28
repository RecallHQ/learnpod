export interface Pod {
  id: string;
  title: string;
  tags: string[];
  image: string;
  queries: number;
  //description: string;
  //thumbnail: string;
  //category: string;
  //urls: string[];
  //createdAt: Date;
  //interactions: number;
  //followers: number;
  status: "ready" | "processing" | "error"; //| 'uploading' | 'error';
  //isFollowing?: boolean;
}

export interface PodResponseData {
  id: string;
  title: string;
  tags: string[];
  image: string;
  video_path: string;
  introduction: string;
}

export interface QueryResponse {
  knowledge_base: string;
  query: string;
  response: string;
  video_path: string;
  images_paths: string[];
  start_time: string;
  end_time: string;
}

export interface ChatMessage {
  id?: string;
  type: "user" | "ai";
  question?: string;
  timestamp: string;
  answer?: string;
  videoPath?: string;

  feedback?: "like" | "dislike";
  feedbackComment?: string;
  feedbackCategory?: string;

  knowledgeBaseId?: string;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface CreatePodFormData {
  title: string;
  // description: string;
  video_urls: string[];
}
