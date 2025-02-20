import readline from "readline"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

export function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer)
    })
  })
}

export function closeReadline() {
  rl.close()
}
