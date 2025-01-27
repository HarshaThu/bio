import React, { createContext, useContext, useCallback, useState } from "react";
import { chat } from "@/lib/gemini";

interface Message {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
}

interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (message: string, imageFile?: File) => Promise<void>;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (message: string, imageFile?: File) => {
    try {
      setIsLoading(true);
      
      let imageUrl: string | undefined;
      let imageData: string | undefined;
      
      if (imageFile) {
        imageUrl = URL.createObjectURL(imageFile);
        imageData = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(imageFile);
        });
      }

      setMessages(prev => [...prev, { 
        role: "user", 
        content: message,
        imageUrl 
      }]);
      
      const response = await chat(imageData ? { message, imageData } : message);
      
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Sorry, I encountered an error. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <ChatContext.Provider value={{ messages, isLoading, sendMessage, clearChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
