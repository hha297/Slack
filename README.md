# Slack Clone – Fullstack Real-Time Messaging Platform

An **end-to-end fullstack and real-time Slack clone**, featuring **workspaces, channels, 1:1 conversations, threads, and file sharing**.

## 🚀 Tech Stack

- **React.js**
- **TypeScript**
- **Next.js**
- **TailwindCSS**
- **Convex**

## ✨ Features

- **Real-time Communication**: Enables users to send and receive messages instantly, ensuring seamless and real-time communication across the platform.
- **Reactions to Messages**: Allows users to react to messages using emojis or custom reactions, providing a fun and quick way to engage with others.
- **Threads / Replies System**: Facilitates threaded conversations, allowing users to reply to specific messages, keeping discussions organized and focused.
- **Edit / Delete Messages**: Provides users the ability to edit or delete their messages after sending, enabling them to correct mistakes or remove outdated content.
- **Role-Based Access Control**: Implements role-based permissions, ensuring that users have the appropriate level of access to channels, messages, and other resources.
- **File Sharing / Image Attachments**: Allows users to easily share files, documents, and images in chats, making it easier to exchange resources and media within the platform.
- **Authentication with NextAuth v5**: Integrates authentication with NextAuth v5, supporting multiple login providers like Google, Facebook, and more, ensuring safe and reliable user sign-in.
- **Workspace / Channel Creation**: Lets users create workspaces and channels, providing them the flexibility to organize discussions around different projects or topics.
- **Invite System / Invite Codes**: Allows users to invite others to join workspaces or channels using invite links or unique invite codes, streamlining the onboarding process.
- **Direct Messaging**: Empowers users to send direct one-on-one messages, providing a private and personal communication option outside group chats.
- **User Profiles**: Lets users create and customize their profiles with avatars, personal details, and status messages, helping others know more about them.

## 🛠️ Installation

```bash
git clone https://github.com/hha297/Slack.git
cd <repository-folder>
npm install
```

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory and add the following environment variables:

```env
CONVEX_DEPLOYMENT=

NEXT_PUBLIC_CONVEX_URL=
```

👉 **Fill in each variable with your Convex project’s corresponding values.**

## ▶️ Running the project

```bash
npx convex dev
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## 📄 License

[MIT License](LICENSE)

## 🙌 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.
