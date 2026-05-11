import { useQuery } from "@tanstack/react-query";
import ky from "ky";

interface GitHubRepository {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
  };
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  created_at: string; // ISO Date string
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  license: {
    key: string;
    name: string;
    spdx_id: string;
    url: string | null;
  } | null;
  topics: string[];
  subscribers_count?: number; // Only returned by the single repo endpoint
  network_count?: number; // Only returned by the single repo endpoint
}

const getGitRepositoryData = async (): Promise<GitHubRepository> => {
  const res = await ky("https://api.github.com/repos/oven-sh/bun");
  return res.json();
};

export const GitRepositoryUsage = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["repoData"],
    queryFn: getGitRepositoryData,
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong>{" "}
      <strong>✨ {data.stargazers_count}</strong>{" "}
      <strong>🍴 {data.forks_count}</strong>
    </div>
  );
};
