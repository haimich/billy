import * as React from 'react'
import * as path from 'path'

const WORD = /.*.(doc|docx|pages)/i
const EXCEL = /.*.(xls|xlsx|numbers)/i
const PDF = /.*.pdf/i
const ZIP = /.*.(zip|.gz)/i
const IMAGE = /.*.(jpg|jpeg|png|gif|tiff|bmp)/i
const TEXT = /.*.txt/i
const AUDIO = /.*.(mp3|wav|aac|aiff|m4a|wma)/i
const PRESENTATION = /.*.(ppt|pptx|key)/i
const MOVIE = /.*.(avi|mpg|mpeg|f4v|flv|ogv|wmv|mp4)/i

export function getFileIconHtml(filename: string): JSX.Element {
  let extension = path.parse(filename).ext
  let classes = 'fa ' + getFaTypeForExtension(extension)

  return (
    <i className={classes} aria-hidden="true" />
  )
}

function getFaTypeForExtension(extension: string): string {
  if (WORD.test(extension)) {
    return 'fa-file-word-o'
  } else if (EXCEL.test(extension)) {
    return 'fa-file-excel-o'
  } else if (PDF.test(extension)) {
    return 'fa-file-pdf-o'
  } else if (ZIP.test(extension)) {
    return 'fa-file-archive-o'
  } else if (IMAGE.test(extension)) {
    return 'fa-file-image-o'
  } else if (TEXT.test(extension)) {
    return 'fa-file-text-o'
  } else if (AUDIO.test(extension)) {
    return 'fa-file-audio-o'
  } else if (PRESENTATION.test(extension)) {
    return 'fa-file-powerpoint-o'
  } else if (MOVIE.test(extension)) {
    return 'fa-file-movie-o'
  } else {
    return 'fa-file-o'
  }
}