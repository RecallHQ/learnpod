export const getPublicImageUrl = (imagePath: string) => {
  console.log("Original image path:", imagePath);
  
  // If it's already a URL, return as-is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // For local development, serve files through the API
  const baseUrl = "http://localhost:8000";
  
  // Handle the specific pattern from recall-api: /path/to/cwd/../recallhq/filename
  if (imagePath.includes('/recallhq/')) {
    // Extract the path after /recallhq/
    const recallhqIndex = imagePath.indexOf('/recallhq/');
    console.log("Found /recallhq/ at index:", recallhqIndex);
    if (recallhqIndex !== -1) {
      const pathAfterRecallhq = imagePath.substring(recallhqIndex + '/recallhq/'.length);
      const finalUrl = `${baseUrl}/files/${pathAfterRecallhq}`;
      console.log("Path after /recallhq/:", pathAfterRecallhq);
      console.log("Final transformed URL:", finalUrl);
      return finalUrl;
    }
  }
  
  // Handle absolute paths starting with /
  if (imagePath.startsWith('/')) {
    const finalUrl = `${baseUrl}/files${imagePath}`;
    console.log("Transformed image URL (absolute path):", finalUrl);
    return finalUrl;
  }
  
  // Fallback for relative paths
  const finalUrl = `${baseUrl}/files/${imagePath}`;
  console.log("Transformed image URL (relative):", finalUrl);
  return finalUrl;
};

export const getPublicVideoUrl = (videoPath: string) => {
  console.log("Original video path:", videoPath);
  
  // If it's already a URL, return as-is
  if (!videoPath || videoPath.startsWith('http')) {
    return videoPath || "";
  }
  
  // For local development, serve files through the API
  const baseUrl = "http://localhost:8000";
  
  // Handle the specific pattern from recall-api: /path/to/cwd/../recallhq/filename
  if (videoPath.includes('/recallhq/')) {
    // Extract the path after /recallhq/
    const recallhqIndex = videoPath.indexOf('/recallhq/');
    console.log("Found /recallhq/ at index:", recallhqIndex);
    if (recallhqIndex !== -1) {
      const pathAfterRecallhq = videoPath.substring(recallhqIndex + '/recallhq/'.length);
      const finalUrl = `${baseUrl}/files/${pathAfterRecallhq}`;
      console.log("Path after /recallhq/:", pathAfterRecallhq);
      console.log("Final transformed video URL:", finalUrl);
      return finalUrl;
    }
  }
  
  // Handle other local paths
  if (videoPath.startsWith('/')) {
    return `${baseUrl}/files${videoPath}`;
  }
  
  // Fallback for relative paths
  return `${baseUrl}/files/${videoPath}`;
};
