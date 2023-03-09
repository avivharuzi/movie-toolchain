import fs from 'node:fs';

import { getTextFileContent } from './get-text-file-content';

export interface FixSRTFileOptions {
  removeTextFormatting: boolean;
}

interface Subtitle {
  index: string | null;
  begin: string | null;
  end: string | null;
  line1: string | null;
  line2: string | null;
}

const SRT_TAGS_REGEX =
  /<b>|<\/b>|{b}|{\/b}|<i>|<\/i>|{i}|{\/i}|<u>|<\/u>|{u}|{\/u}|<font color=".*">|<font color='.*'>|<\/font>|{\\a.*}/gi;

const DASH_REGEX = /^-+|-+$/gm;

const SPACE_BETWEEN_REGEX = /\s+/g;

const UNDEFINED_CHAR_REGEX = /�/g;

const getEmptySubtitle = (): Subtitle => {
  return {
    index: null,
    begin: null,
    end: null,
    line1: null,
    line2: null,
  };
};

const fixTextLine = (line: string, removeTextFormatting = false) => {
  let modifiedLine = line.trim();

  if (!removeTextFormatting) {
    return modifiedLine;
  }

  modifiedLine = modifiedLine.replace(SRT_TAGS_REGEX, '');
  modifiedLine = modifiedLine.trim();
  modifiedLine = modifiedLine.replace(DASH_REGEX, '');
  modifiedLine = modifiedLine.trim();
  modifiedLine = modifiedLine.replace(SPACE_BETWEEN_REGEX, ' ');
  modifiedLine = modifiedLine.trim();
  modifiedLine = modifiedLine.replace(UNDEFINED_CHAR_REGEX, '');
  modifiedLine = modifiedLine.trim();

  return modifiedLine;
};

export const fixSRTFile = async (
  filePath: string,
  targetFilePath: string,
  { removeTextFormatting }: FixSRTFileOptions
): Promise<void> => {
  const textFileContent = await getTextFileContent(filePath);

  const subtitles = getSubtitlesFromText(textFileContent, removeTextFormatting);

  const text = getTextFromSubtitles(subtitles);

  await fs.promises.writeFile(targetFilePath, text, {
    encoding: 'utf-8',
  });
};

const getSubtitlesFromText = (
  text: string,
  removeTextFormatting = false
): Subtitle[] => {
  // Split text to lines
  const lines = text.trim().split('\n');

  if (!(lines.length > 0)) {
    throw new Error('Invalid text, no lines were found');
  }

  // Fix last line because in the loop we're always looking for empty line in order to push the subtitle.
  lines.push('');

  const subtitles: Subtitle[] = [];
  let currentSubtitle = getEmptySubtitle();

  for (const line of lines) {
    const currentLine: string = line.trim();

    if (currentLine === '') {
      // If we have empty line and at least one text line that's mean we have one complete subtitle.
      if (
        currentSubtitle.index !== null &&
        currentSubtitle.begin !== null &&
        currentSubtitle.end !== null &&
        currentSubtitle.line1 !== null
      ) {
        subtitles.push(currentSubtitle);
      }

      // Assign new empty subtitle.
      currentSubtitle = getEmptySubtitle();

      continue;
    }

    // Check for index.
    if (currentSubtitle.index === null) {
      if (isNaN(parseInt(currentLine, 0))) {
        throw new Error('Invalid text, index must be number');
      }

      currentSubtitle.index = currentLine;

      continue;
    }

    // Check for begin and end.
    if (currentSubtitle.begin === null || currentSubtitle.end === null) {
      const times = currentLine.split('-->') as [string, string];

      if (times.length !== 2) {
        throw new Error(
          'Invalid text, begin and end times must separated by -->'
        );
      }

      currentSubtitle.begin = times[0].trim();
      currentSubtitle.end = times[1].trim();

      continue;
    }

    // Check for line1
    if (currentSubtitle.line1 === null) {
      currentSubtitle.line1 = fixTextLine(currentLine, removeTextFormatting);

      continue;
    }

    // Check for line2
    if (currentSubtitle.line2 === null) {
      currentSubtitle.line2 = fixTextLine(currentLine, removeTextFormatting);
    }
  }

  return subtitles;
};

const getTextFromSubtitles = (subtitles: Subtitle[]): string => {
  let text = '';

  for (const [index, subtitle] of subtitles.entries()) {
    const lineNumber = index + 1;

    text += `${lineNumber}\n`;
    text += `${subtitle.begin} --> ${subtitle.end}\n`;
    text += `${subtitle.line1}\n`;

    if (subtitle.line2) {
      text += `${subtitle.line2}\n`;
    }

    if (subtitles.length !== lineNumber) {
      text += '\n';
    }
  }

  return text;
};
