
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { eventAssistant, type EventAssistantInput } from '@/ai/flows/event-assistant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, User, Loader2 } from 'lucide-react';
import { useToast } from './ui/use-toast';
import type { Event } from '@/lib/data';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface EventAssistantProps {
  eventContext?: Event;
}

const GeminiLogo = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6 text-primary"
    >
      <path d="M12 2L9.91 9.91L2 12L9.91 14.09L12 22L14.09 14.09L22 12L14.09 9.91L12 2Z" />
    </svg>
  );

export default function EventAssistant({ eventContext }: EventAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const assistantInput: EventAssistantInput = { userQuery: currentInput };
      if (eventContext) {
        assistantInput.eventContext = eventContext;
      }
      const result = await eventAssistant(assistantInput);
      const assistantMessage: Message = { role: 'assistant', content: result.answer };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Assistant Error:', error);
      toast({
        title: "Error",
        description: "The AI assistant is currently unavailable. Please try again later.",
        variant: "destructive",
      });
      setMessages(prev => prev.filter(msg => msg.content !== currentInput)); // Remove user message on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <GeminiLogo />
          <span>Event Assistant</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 flex flex-col">
          <ScrollArea className="flex-grow h-64 pr-4 -mr-4 mb-4">
            <div className="space-y-4">
                <AnimatePresence>
                    {messages.map((message, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                    >
                        {message.role === 'assistant' && (
                        <div className="bg-primary p-2 rounded-full text-primary-foreground">
                            <Bot size={16} />
                        </div>
                        )}
                        <div
                        className={`max-w-xs rounded-lg px-4 py-2 text-sm ${
                            message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary'
                        }`}
                        >
                        {message.content}
                        </div>
                        {message.role === 'user' && (
                        <div className="bg-muted p-2 rounded-full text-muted-foreground">
                            <User size={16} />
                        </div>
                        )}
                    </motion.div>
                    ))}
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-start gap-3"
                        >
                           <div className="bg-primary p-2 rounded-full text-primary-foreground">
                                <Bot size={16} />
                            </div>
                            <div className="bg-secondary rounded-lg px-4 py-3 flex items-center justify-center">
                                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                 {messages.length === 0 && (
                    <div className="text-center text-sm text-muted-foreground pt-16">
                        <p>Have a question about this event?</p>
                        <p>Ask me anything!</p>
                    </div>
                )}
            </div>
          </ScrollArea>
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about this event..."
              disabled={isLoading}
              autoComplete="off"
            />
            <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
