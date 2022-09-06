import { window, StatusBarAlignment, ExtensionContext, StatusBarItem, TextEditor } from 'vscode'

const countOccurrences = (editor: TextEditor | undefined): number => {
  const selection = editor?.document.getText(editor?.selection)

  // No text selected
  if (!editor || !selection) return 0

  // Count occurrences (dubious method 👀)
  return editor.document.getText().split(selection).length - 1
}

const updateItem = (item: StatusBarItem) => () => {
  const occurrences = countOccurrences(window.activeTextEditor)
  if (occurrences > 0) {
    item.text = `${occurrences} occurrence${occurrences === 1 ? '' : 's'}`
    item.show()
  } else {
    item.hide()
  }
}

export const activate = ({ subscriptions }: ExtensionContext) => {
  // Create the status bar item
  const item: StatusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 500)
  subscriptions.push(item)

  // Keep the item up to date
  subscriptions.push(window.onDidChangeActiveTextEditor(updateItem(item)))
  subscriptions.push(window.onDidChangeTextEditorSelection(updateItem(item)))

  updateItem(item)()
}
