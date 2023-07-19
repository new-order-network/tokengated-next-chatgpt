'use client'

import { useChat, type Message } from 'ai/react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { toast } from 'react-hot-toast'
const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

export function Chat({
  id,
  initialMessages,
  className
}: ChatProps): JSX.Element {
  useChat()
  const [previewToken, setPreviewToken] = useState<string | null>('ai-token')
  const [previewTokenDialog, setPreviewTokenDialog] =
    useState<boolean>(IS_PREVIEW)
  const [previewTokenInput, setPreviewTokenInput] = useState<string>(
    previewToken ?? ''
  )
  const [messages, setMessages] = useState<Message[]>(initialMessages || [])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')

  const fetchLastUserMessage = async (): Promise<void> => {
    try {
      setIsLoading(true)

      const payload = {
        messages: [
          {
            role: 'user',
            content: input
          }
        ]
      }

      const response = await fetch(
        'http://157.245.65.240:8000/get_last_user_message/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      )

      if (!response.ok) {
        throw new Error('An error occurred')
      }

      const data = await response.json()

      const userMessage: Message = {
        id: data.id,
        role: 'user',
        content: input
      }
      const newMessage: Message = {
        id: data.id,
        role: 'assistant',
        content: data
      }

      setMessages(prevMessages => [...prevMessages, userMessage, newMessage])
      setIsLoading(false)
      setInput('')
    } catch (error) {
      setIsLoading(false)
      toast.error('An error occurred. Please try again.')
    }
  }

  return (
    <>
      <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
        {messages.length ? (
          <>
            <ChatList messages={messages} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <EmptyScreen setInput={setInput} />
        )}
      </div>
      <ChatPanel
        id={id}
        isLoading={isLoading}
        stop={fetchLastUserMessage}
        append={fetchLastUserMessage as any}
        reload={fetchLastUserMessage as any}
        messages={messages}
        input={input}
        setInput={setInput}
      />

      <Dialog open={previewTokenDialog} onOpenChange={setPreviewTokenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your OpenAI Key</DialogTitle>
            <DialogDescription>
              If you have not obtained your OpenAI API key, you can do so by{' '}
              <a
                href="https://platform.openai.com/signup/"
                className="underline"
              >
                signing up
              </a>{' '}
              on the OpenAI website. This is only necessary for preview
              environments so that the open source community can test the app.
              The token will be saved to your browser&apos;s local storage under
              the name <code className="font-mono">ai-token</code>.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={previewTokenInput}
            placeholder="OpenAI API key"
            onChange={e => setPreviewTokenInput(e.target.value)}
          />
          <DialogFooter className="items-center">
            <Button
              onClick={() => {
                setPreviewToken(previewTokenInput)
                setPreviewTokenDialog(false)
              }}
            >
              Save Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
