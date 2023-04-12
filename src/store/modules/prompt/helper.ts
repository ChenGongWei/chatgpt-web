import { ss } from '@/utils/storage'
import prompts from '@/assets/prompts.json'

const LOCAL_NAME = 'promptStore'

export type PromptList = any[]

export interface PromptStore {
  promptList: PromptList
}

export function getLocalPromptList(): PromptStore {
  const promptStore: PromptStore | undefined = ss.get(LOCAL_NAME)
  if (!promptStore) {
    setLocalPromptList({ promptList: prompts })
    return { promptList: prompts }
  }
  return promptStore
}

export function setLocalPromptList(promptStore: PromptStore): void {
  ss.set(LOCAL_NAME, promptStore)
}
