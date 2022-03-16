const vscode = require('vscode');

const Commands = vscode.commands;
const Window = vscode.window;
const encoder = require('./alphabet');
const { toArray } = require('./helpers/array');

const converter = (text, converTable) => {
  const words = text
    .trim()
    .split(/[\s\.,!\?\(\)\[\]\{\}<>@#$%^&*;:'"`]/)
    .map(word => {
      return word;
    });

  return toArray(words.join(' '))
    .map(symbol => (!(symbol in converTable) ? symbol : converTable[symbol]))
    .join('');
};

const strToSlug = str => {
  const strEncode = converter(str, encoder).toLowerCase();
  return strEncode.replace(/[^a-z0-9]/gm, '\\').replace(/[-]{1,}/gm, '\\');
};

const encode = () => {
  const editor = Window.activeTextEditor;
  if (!editor) return;

  const selections = editor.selections;

  if (selections.length === 0) return;

  editor.edit(editBuilder => {
    selections.forEach(selectionItem => {
      const text = editor.document.getText(selectionItem);
      const convertedText = converter(text, encoder);

      editBuilder.replace(selectionItem,"*" + convertedText + "*" + "  #" + text);
    });
  });
};

const reg = (name, callback) => {
  Commands.registerTextEditorCommand('citools.encode', callback);
};

exports.activate = context => {
  context.subscriptions.push(reg('encode', encode));
};

exports.deactivate = () => {};
