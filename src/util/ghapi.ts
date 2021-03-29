/*
 * Copyright (C) 2020 Splaterxl
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import {Builder, TaskType} from "@splatterxl/fetchbuilder";
interface Constructor {
  new (data: any): any	
}
export const useGitHubApiRouter = <T>(C?: Constructor) => {
  const builder = new Builder<T>("https://api.github.com");
  return [builder.routeBuilder()]
}


export class GitHubRepo {
  id: number;
  //@ts-ignore
  constructor(o: Record<string,any>) {for(const[k,v]of Object.entries(o))this[k]=v;this.owner=new GitHubUser(this.owner)}
  name: string;
  full_name: string;
  public private: boolean;
  owner: GitHubUser;
  html_url: string;
  description: string;
  fork: boolean;
  homepage: string;
  size: number;

  created_at: string;
  get createdAt() {
    return new Date(this.created_at)
  }
  get createdTimestamp() {
    return this.createdAt.getTime()
  }
  updated_at: string;
  get updatedAt() {
    return new Date(this.updated_at)
  }
  get updatedTimestamp() {
    return this.updatedAt.getTime()
  }

  pushed_at: string;
  get pushedAt() {
    return new Date(this.pushed_at)
  }
  get pushedTimestamp() {
    return this.pushedAt.getTime()
  }

  stargazers_count: number
  watchers_count: number
  forks: number
  watchers: number
  open_issues: number
  default_branch: string
  language: string
}
export class GitHubUser {
  //@ts-ignore
  constructor(o: Record<string,any>) {for(const[k,v]of Object.entries(o))this[k]=v;this.owner=new GitHubUser(this.owner)}
  id: number;
  login: string;
  avatar_url: string;
  html_url: string
}
