import React, { useRef, useState } from "react";
import { useChat } from "@/contexts/ChatContext";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
} from "@/components/ui/expandable-chat";
import { Send, Loader2, Image as ImageIcon, X, RefreshCw } from "lucide-react";
import Image from "next/image";
import { ProductCard } from "./ui/product-card";

export function ChatComponent() {
  const { data: session } = useSession();
  const { messages, isLoading, sendMessage, clearChat } = useChat();
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
      } else {
        alert('Please select an image file');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage && !input.trim() || isLoading) return;

    const message = input.trim() || "Please analyze this image";
    setInput("");
    await sendMessage(message, selectedImage || undefined);
    setSelectedImage(null);
  };

  const handleRefresh = () => {
    clearChat();
    setInput("");
    setSelectedImage(null);
  };

  return (
    <ExpandableChat position="bottom-right" size="md">
      {!session ? (
        <div className="p-4 text-center">
          <p className="mb-2">Please log in to use the chat</p>
          <Button asChild variant="outline">
            <a href="/login">Login</a>
          </Button>
        </div>
      ) : (
        <>
          <ExpandableChatHeader>
            <div className="flex items-center justify-between w-full">
              <h3 className="text-lg font-semibold">Garden Assistant</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                className="hover:bg-muted"
                title="Clear chat"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </ExpandableChatHeader>
      
          <ExpandableChatBody className="p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index}>
                <div
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted"
                    }`}
                  >
                    {message.imageUrl && (
                      <div className="mb-2 relative w-full h-[200px] rounded-lg overflow-hidden">
                        <Image
                          src={message.imageUrl}
                          alt="Uploaded image"
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                    <div className={message.role === "assistant" ? "text-sm leading-relaxed" : ""}>
                      {message.content}
                    </div>
                  </div>
                </div>
                {message.suggestedProducts && message.suggestedProducts.length > 0 && (
                  <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
                    {message.suggestedProducts.map((product, i) => (
                      <ProductCard
                        key={i}
                        id={product.id}
                        name={product.name}
                        description={product.description}
                        price={product.price}
                        imageUrl={product.imageUrl}
                        category={product.category}
                        compact
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </ExpandableChatBody>

          <ExpandableChatFooter>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me about gardening, plants, or upload a plant photo..."
                className="flex-1 min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                disabled={isLoading}
              />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageChange}
              />
              <div className="flex gap-2">
                {selectedImage ? (
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => setSelectedImage(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={handleImageClick}
                    disabled={isLoading}
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                )}
                <Button type="submit" size="icon" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>
          </ExpandableChatFooter>
        </>
      )}
    </ExpandableChat>
  );
}
