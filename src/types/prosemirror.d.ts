declare module 'prosemirror-view' {
    export let EditorView: any;
}

declare module 'prosemirror-state' {
    export let EditorState: any;
    export let Plugin: any;
    export let NodeSelection: any;
}

declare module 'prosemirror-markdown' {
    export let schema: any;
    export let defaultMarkdownParser: any;
    export let defaultMarkdownSerializer: any;
}

declare module 'prosemirror-example-setup' {
    export let exampleSetup: any;
}

declare module 'prosemirror-commands' {
    export let baseKeymap: any;
    export let wrapIn: any;
    export let setBlockType: any;
    export let chainCommands: any;
    export let toggleMark: any;
    export let exitCode: any;
    export let joinUp: any;
    export let joinDown: any;
    export let lift: any;
    export let selectParentNode: any;
}

declare module 'prosemirror-history' {
    export let history: any;
    export let redo: any;
    export let undo: any;
}
declare module 'prosemirror-keymap' {
    export let keymap: any;
}
declare module 'prosemirror-dropcursor' {
    export let dropCursor: any
}
declare module 'prosemirror-gapcursor' {
    export let gapCursor: any
}
declare module 'prosemirror-menu' {
    export let menuBar: any
    export let wrapItem: any
    export let blockTypeItem: any
    export let Dropdown: any
    export let DropdownSubmenu: any
    export let joinUpItem: any
    export let liftItem: any
    export let selectParentNodeItem: any
    export let undoItem: any
    export let redoItem: any
    export let icons: any
    export let MenuItem: any
}

declare module 'prosemirror-schema-list' {
    export let wrapInList: any
    export let splitListItem: any
    export let liftListItem: any
    export let sinkListItem: any
}

declare module 'prosemirror-inputrules' {
    export let inputRules: any
    export let wrappingInputRule: any
    export let textblockTypeInputRule: any
    export let smartQuotes: any
    export let emDash: any
    export let ellipsis: any
    export let undoInputRule: any
}
