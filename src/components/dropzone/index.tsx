import { DetailedHTMLProps, HTMLAttributes, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface DropZoneProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  setFile: (file: Uint8Array) => void;
}

export function DropZone({ setFile, ...componentProps }: DropZoneProps) {
  const onDrop = useCallback(async (file: File[]) => {
    const buffer = await file[0].arrayBuffer();
    setFile(new Uint8Array(buffer));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      {...componentProps}
      style={{
        borderRadius: '4px',
        backgroundColor: 'palevioletred',
        fontSize: 16,
        cursor: 'pointer',
      }}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag and drop some files here, or click to select files</p>
      )}
    </div>
  );
}
