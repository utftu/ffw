import ts from 'typescript';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

function compile() {
  const program = ts.createProgram([path.join(__dirname, './src/index.ts')], {
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    target: ts.ScriptTarget.ESNext,
    declaration: true,
    emitDeclarationOnly: true,
    declarationDir: path.join(__dirname, './dist/types'),
    skipLibCheck: true,
  });
  const emitResult = program.emit();

  let allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  allDiagnostics.forEach((diagnostic) => {
    if (diagnostic.file) {
      let {line, character} = ts.getLineAndCharacterOfPosition(
        diagnostic.file,
        diagnostic.start
      );
      let message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        '\n'
      );
      console.log(
        `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
      );
    } else {
      console.log(
        ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
      );
    }
  });
}

compile();
