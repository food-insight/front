import { convertWebMToWav } from 'webm-to-wav-converter';

export const convertWebMToWavFile = async (webmFile) => {
    const arrayBuffer = await webmFile.arrayBuffer();
    const wavBuffer = await convertWebMToWav(arrayBuffer);

    // Create a Blob from the output buffer
    const wavBlob = new Blob([wavBuffer], { type: 'audio/wav' });

    // Create a File object from the Blob
    const wavFile = new File([wavBlob], 'output.wav', { type: 'audio/wav' });

    return wavFile;
};