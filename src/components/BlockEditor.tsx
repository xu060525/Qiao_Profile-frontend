"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight'
import { useEffect } from 'react';

// 阴图 Atom One Dark 代码高亮主题
import 'highlight.js/styles/atom-one-dark.css'; 

// 初始化 lowlight, 加载常用的语言解析器
const lowlight = createLowlight(common); 

interface BlockEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function BlockEditor({ content, onChange }: BlockEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // 开启基础支持，包含标题、列表、加粗、斜体等，并自带 Markdown 快捷键解析
        heading: {
          levels: [1, 2, 3],
        },
        // 关闭 StarterKit 默认的代码块
        codeBlock: false, 
      }),
      // 挂载代码块解析引擎
      CodeBlockLowlight.configure({
        lowlight, 
      })
    ],
    content: content,
    // 每次输入内容变化时，将生成的 HTML 传回给父组件
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        // 这里的 class 是 Tailwind 针对富文本的定制化排版
        class: 'prose prose-invert prose-orange max-w-none focus:outline-none min-h-[120px] text-lg leading-relaxed',
      },
    },
  });

  // 当外部清空内容时（比如发布成功后），同步清空编辑器
  useEffect(() => {
    if (editor && content === '') {
      editor.commands.setContent('');
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full">
      {/* 编辑器内容区域 */}
      <EditorContent editor={editor} />
      
      {/* 极简的交互提示 */}
      <div className="mt-4 text-xs text-neutral-600 font-mono flex gap-4">
        <span># + Space: 一级标题</span>
        <span>* + Space: 列表</span>
        <span>**文本**: 加粗</span>
      </div>
    </div>
  );
}