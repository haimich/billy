import * as React from 'react'
import * as ReactDOM from 'react-dom'
import FileModel from '../models/FileModel'
import FileActions from '../models/FileActions'
import { getFilename } from '../ui/formatters'
import t from '../helpers/i18n'

export abstract class FileEndabledComponent<Props, State> extends React.Component<Props, State> {

  dragCounter: number

  constructor(props) {
    super(props)

    this.dragCounter = 0
  }

  abstract handleAddFiles(files: FileModel[])
  abstract handleDeleteFile(file: FileModel)
  abstract getFileModels(files: File[]): FileModel[]

  onDrag(event) {
    event.preventDefault()
  }

  onEnter() {
    this.dragCounter++
    ReactDOM.findDOMNode(this).classList.add('busy')
  }

  onLeave() {
    this.dragCounter--
    if (this.dragCounter === 0) {
      ReactDOM.findDOMNode(this).classList.remove('busy')
    }
  }

  onDrop(event) {
    event.preventDefault()
    this.handleAddFiles(this.getFileModels(event.dataTransfer.files))
    this.onLeave()
  }

  resetDragCounter() {
    this.dragCounter = 0
  }

  fileWithNameExists(filePath: string, existingFiles: FileModel[]): boolean {
    for (let file of existingFiles) {
      if (getFilename(file.path) === getFilename(filePath)) {
        return true
      }
    }

    return false
  }

  fileExists(file: FileModel, fileList: FileModel[]): boolean {
    for (let element of fileList) {
      console.log('fileExists', element);
      
      if (file.id != null && element.id != null && file.id === element.id) {
        return true
      } else if (file.path === element.path) {
        return true
      }
    }

    return false
  }

  addFiles(files: FileModel[], keepList: FileModel[], deleteList: FileModel[], addList: FileModel[]): FileActions<FileModel> {
    if (files == null) {
      return
    }

    for (let file of files) {
      if (this.fileExists(file, addList)) {
        continue
      }

      if (this.fileWithNameExists(file.path, keepList)) {
        if (!confirm(t(`Eine Datei mit dem Namen "${getFilename(file.path)}" existiert bereits. Soll sie überschrieben werden?`))) {
          continue
        }

        let originalFile

        keepList = keepList.filter(element => {
          if (getFilename(element.path) !== getFilename(file.path)) {
            return true
          } else {
            // we found the file to be overwritten
            originalFile = element
            return false
          }
        })
        deleteList = deleteList.concat(originalFile)
      }

      addList = addList.concat(file)
    }

    return {
      keep: keepList,
      add: addList,
      delete: deleteList
    }
  }

  deleteFile(file: FileModel, keepList: FileModel[], deleteList: FileModel[], addList: FileModel[]): FileActions<FileModel> {
    if (! confirm(t('Möchtest du die Datei wirklich entfernen?'))) {
      return
    }

    const isExisting = (file.id != null)

    return {
      keep: keepList.filter(element => {
        if (isExisting && file.id === element.id) {
          // existing file should be deleted
          return false
        } else {
          return true
        }
      }),
      add: addList.filter(element => {
        if (file.path === element.path) {
          // added file should be unadded
          return false
        } else {
          return true
        }
      }),
      delete: (isExisting)
        ? deleteList.concat([file])
        : deleteList
    }
  }

  setState(state): void {
    return super.setState(state)
  }

}