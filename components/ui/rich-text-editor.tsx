"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Color from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    Link as LinkIcon,
    Undo,
    Redo,
    AlignCenter,
    AlignLeft,
    AlignRight,
    Highlighter,
    Type,
    Heading2,
    Heading3
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
}

const MenuButton = ({
    isActive,
    onClick,
    disabled,
    children,
    title
}: {
    isActive?: boolean,
    onClick: () => void,
    disabled?: boolean,
    children: React.ReactNode,
    title?: string
}) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={cn(
            "p-1.5 rounded-md transition-colors hover:bg-zinc-100",
            isActive ? "bg-zinc-100 text-zinc-900" : "text-zinc-500",
            disabled && "opacity-30 cursor-not-allowed"
        )}
    >
        {children}
    </button>
)

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline cursor-pointer',
                },
            }),
            TextStyle,
            Color,
            Highlight.configure({ multicolor: true }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Placeholder.configure({
                placeholder: placeholder || 'Inizia a scrivere...',
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: cn(
                    "prose prose-sm max-w-none focus:outline-none min-h-[150px] px-4 py-3 bg-white",
                    className
                ),
            },
        },
    })

    if (!editor) return null

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL del link:', previousUrl)
        if (url === null) return
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }

    return (
        <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-zinc-900/5 transition-all">
            <div className="flex flex-wrap items-center gap-1 p-1.5 border-b border-zinc-100 bg-zinc-50/50">
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="Grassetto"
                >
                    <Bold className="size-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="Corsivo"
                >
                    <Italic className="size-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive('underline')}
                    title="Sottolineato"
                >
                    <UnderlineIcon className="size-4" />
                </MenuButton>

                <div className="w-px h-4 bg-zinc-200 mx-1" />

                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    title="Titolo 2"
                >
                    <Heading2 className="size-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive('heading', { level: 3 })}
                    title="Titolo 3"
                >
                    <Heading3 className="size-4" />
                </MenuButton>

                <div className="w-px h-4 bg-zinc-200 mx-1" />

                <MenuButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    title="Elenco puntato"
                >
                    <List className="size-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    title="Elenco numerato"
                >
                    <ListOrdered className="size-4" />
                </MenuButton>

                <div className="w-px h-4 bg-zinc-200 mx-1" />

                <MenuButton
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    isActive={editor.isActive({ textAlign: 'left' })}
                    title="Allinea a sinistra"
                >
                    <AlignLeft className="size-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    isActive={editor.isActive({ textAlign: 'center' })}
                    title="Allinea al centro"
                >
                    <AlignCenter className="size-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    isActive={editor.isActive({ textAlign: 'right' })}
                    title="Allinea a destra"
                >
                    <AlignRight className="size-4" />
                </MenuButton>

                <div className="w-px h-4 bg-zinc-200 mx-1" />

                <MenuButton onClick={setLink} isActive={editor.isActive('link')} title="Inserisci link">
                    <LinkIcon className="size-4" />
                </MenuButton>

                <MenuButton
                    onClick={() => editor.chain().focus().toggleHighlight({ color: '#ffec3d' }).run()}
                    isActive={editor.isActive('highlight')}
                    title="Evidenzia"
                >
                    <Highlighter className="size-4" />
                </MenuButton>

                <div className="flex-1" />

                <MenuButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Annulla">
                    <Undo className="size-4" />
                </MenuButton>
                <MenuButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Ripristina">
                    <Redo className="size-4" />
                </MenuButton>
            </div>

            <EditorContent editor={editor} />

            <style jsx global>{`
                .tiptap p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #adb5bd;
                    pointer-events: none;
                    height: 0;
                }
            `}</style>
        </div>
    )
}
