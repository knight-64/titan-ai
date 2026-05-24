import axios, { AxiosInstance } from "axios";
import { AuthResponse, User, Chat, Message, Memory, Profile } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

class TitanAPI {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}/api`,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Set token from localStorage
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("token");
      if (this.token) {
        this.setAuthHeader(this.token);
      }
    }
  }

  private setAuthHeader(token: string) {
    this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  // Auth endpoints
  async signup(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>("/auth/signup", {
      email,
      password,
      name,
    });
    if (response.data.token) {
      this.token = response.data.token;
      this.setAuthHeader(this.token);
    }
    return response.data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    if (response.data.token) {
      this.token = response.data.token;
      this.setAuthHeader(this.token);
    }
    return response.data;
  }

  // Chat endpoints
  async sendMessage(
    message: string,
    chatId?: string,
    aiMode?: string
  ): Promise<Response> {
    const response = await fetch(`${API_URL}/api/chat/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({ message, chatId, aiMode }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response;
  }

  async getChatList(): Promise<Chat[]> {
    const response = await this.client.get<Chat[]>("/chat/list");
    return response.data;
  }

  async getChatHistory(chatId: string): Promise<{ id: string; messages: Message[] }> {
    const response = await this.client.get(`/chat/history/${chatId}`);
    return response.data;
  }

  // Memory endpoints
  async createMemory(
    category: string,
    title: string,
    content: string
  ): Promise<Memory> {
    const response = await this.client.post<Memory>("/memory/create", {
      category,
      title,
      content,
    });
    return response.data;
  }

  async getMemories(category?: string): Promise<Memory[]> {
    const params = category ? { category } : {};
    const response = await this.client.get<Memory[]>("/memory/list", { params });
    return response.data;
  }

  async getMemory(id: string): Promise<Memory> {
    const response = await this.client.get<Memory>(`/memory/${id}`);
    return response.data;
  }

  async updateMemory(
    id: string,
    data: Partial<Memory>
  ): Promise<Memory> {
    const response = await this.client.put<Memory>(`/memory/${id}`, data);
    return response.data;
  }

  async deleteMemory(id: string): Promise<void> {
    await this.client.delete(`/memory/${id}`);
  }

  async searchMemories(query: string): Promise<Memory[]> {
    const response = await this.client.get<Memory[]>("/memory/search/query", {
      params: { q: query },
    });
    return response.data;
  }

  // AI endpoints
  async getAIModes(): Promise<any[]> {
    const response = await this.client.get("/ai/modes");
    return response.data;
  }

  async getCurrentMode(): Promise<{ mode: string }> {
    const response = await this.client.get("/ai/current");
    return response.data;
  }

  async updateMode(mode: string): Promise<{ id: string; aiMode: string }> {
    const response = await this.client.put("/ai/mode", { aiMode: mode });
    return response.data;
  }

  async getProfile(): Promise<Profile> {
    const response = await this.client.get<Profile>("/ai/profile");
    return response.data;
  }
}

export const api = new TitanAPI();
