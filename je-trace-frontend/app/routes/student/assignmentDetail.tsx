import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";

type QA = {
  question: string;
  answer: string;
};

export default function AssignmentPage() {
  const [input, setInput] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [logs, setLogs] = useState<QA[]>([]);
  const [mounted, setMounted] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "답안을 작성하세요...",
      }),
    ],
    content: "<p></p>",
    immediatelyRender: false,
  });

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [logs, currentAnswer]);

  const handleSend = () => {
    if (!input.trim()) return;

    const fakeAnswer = `AI 응답: ${input}에 대한 설명입니다.\n여러 줄도 가능합니다.`;

    setCurrentAnswer(fakeAnswer);
    setLogs((prev) => [...prev, { question: input, answer: fakeAnswer }]);
    setInput("");
  };

  const handleSubmit = () => {
    const finalAnswer = editor?.getHTML();
    console.log({ logs, finalAnswer });
    alert("제출 완료");
  };

  const insertToEditor = (text: string) => {
    editor?.chain().focus().insertContent(`<p>${text}</p>`).run();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    editor?.chain().focus().setImage({ src: url }).run();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    editor
      ?.chain()
      .focus()
      .insertContent(
        `<a href="${url}" target="_blank" class="text-blue-500 underline">${file.name}</a>`
      )
      .run();
  };

  const btn = "px-2 py-1 bg-gray-100 rounded hover:bg-gray-200";

  return (
    <div className="h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 to-slate-200 p-6 text-gray-800">
      <div className="w-full h-full grid grid-cols-[1.2fr_0.8fr] gap-6">

        {/* LEFT */}
        <div className="flex flex-col gap-4 h-full min-h-0">

          <section className="bg-white shadow-sm rounded-2xl px-5 py-4 flex justify-between">
            <h1 className="text-lg font-semibold">자바 컬렉션 정리</h1>
            <Link to="/student/assignments" className="text-sm text-gray-500 hover:text-black">
              ← 목록으로
            </Link>
          </section>

          <section className="bg-white shadow-sm rounded-2xl p-5 flex flex-col flex-1 min-h-0">

            <div className="grid grid-rows-[auto_1fr] gap-4 flex-1 min-h-0">

              <div className="max-h-[160px] overflow-y-auto">
                <h2 className="text-sm font-semibold mb-2">문제 요구 사항</h2>
                <p className="text-sm text-gray-500">
                  List, Set, Map의 차이를 설명하고 각각의 사용 예시를 작성하시오.
                </p>
              </div>

              {/* 에디터 */}
              <div className="flex flex-col min-h-0">
                <h2 className="text-sm font-semibold mb-2">답안 작성</h2>

                {/* 툴바 */}
                <div className="flex flex-wrap gap-2 mb-2 border-b pb-2 text-sm">
                  <button className={btn} onClick={() => editor?.chain().focus().toggleBold().run()}>B</button>
                  <button className={btn} onClick={() => editor?.chain().focus().toggleItalic().run()}>I</button>
                  <button className={btn} onClick={() => editor?.chain().focus().toggleStrike().run()}>S</button>

                  <button className={btn} onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
                  <button className={btn} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>

                  <button className={btn} onClick={() => editor?.chain().focus().toggleBulletList().run()}>•</button>
                  <button className={btn} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>1.</button>

                  <button className={btn} onClick={() => editor?.chain().focus().setTextAlign("left").run()}>좌</button>
                  <button className={btn} onClick={() => editor?.chain().focus().setTextAlign("center").run()}>중</button>
                  <button className={btn} onClick={() => editor?.chain().focus().setTextAlign("right").run()}>우</button>

                  <button className={btn} onClick={() => editor?.chain().focus().toggleBlockquote().run()}>❝</button>
                  <button className={btn} onClick={() => editor?.chain().focus().toggleCodeBlock().run()}>{"</>"}</button>

                  <input type="color" onChange={(e) => editor?.chain().focus().setColor(e.target.value).run()} />
                </div>

                {/* 에디터 */}
                {mounted && editor && (
                  <div className="flex-1 overflow-y-auto border rounded-xl p-3 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-200">
                    <EditorContent editor={editor} />
                  </div>
                )}
              </div>
            </div>

            {/* 하단 버튼 */}
            <div className="pt-4 mt-3 border-t flex justify-between items-center">

              <div className="flex gap-2">
                <button onClick={() => imageInputRef.current?.click()} className="bg-purple-100 text-purple-600 px-3 py-2 rounded-lg text-sm">
                  이미지 업로드
                </button>
                <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageUpload} className="hidden" />

                <button onClick={() => fileInputRef.current?.click()} className="bg-green-100 text-green-600 px-3 py-2 rounded-lg text-sm">
                  파일 업로드
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
              </div>

              <div className="flex gap-2">
                <button className="bg-gray-100 px-4 py-2 rounded-lg text-sm">임시 저장</button>
                <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                  제출
                </button>
              </div>

            </div>
          </section>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col h-full min-h-0">
          <section className="bg-white shadow-sm rounded-2xl p-5 flex flex-col flex-1 min-h-0">

            <h2 className="text-sm font-semibold mb-3">AI 채팅</h2>

            <div ref={chatRef} className="flex-1 overflow-y-auto space-y-4">
              {logs.map((log, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-end">
                    <div className="bg-blue-500 text-white px-3 py-2 rounded-2xl text-sm max-w-[75%]">
                      {log.question}
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap">
                      {log.answer}
                    </div>
                  </div>

                  <button onClick={() => insertToEditor(log.answer)} className="text-xs text-blue-500">
                    답안에 추가
                  </button>
                </div>
              ))}

              {currentAnswer && (
                <div className="space-y-2">
                  <div className="bg-yellow-50 p-3 rounded-xl text-sm">
                    {currentAnswer}
                  </div>
                  <button onClick={() => insertToEditor(currentAnswer)} className="text-xs text-blue-500">
                    답안에 추가
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-4">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-gray-100 border rounded-lg px-3 py-2 text-sm"
              />
              <button onClick={handleSend} className="bg-blue-600 text-white px-4 rounded-lg text-sm">
                질문
              </button>
            </div>

          </section>
        </div>

      </div>
    </div>
  );
}