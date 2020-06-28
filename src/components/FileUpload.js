import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import React, { useCallback, useRef } from 'react';

import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  fileInput: {
    display: 'none',
  }
}));

const FileUpload = ({
  onChange,
  multiple,
  children,
  filter,
  ...buttonProps
}) => {
  const classes = useStyles();

  const fileRef = useRef();

  const handleFileUpload = useCallback((fileObject) => {
    if (!fileObject) return;

    const disallowMultiple = (multiple === false);
    const allFiles = (fileObject.target ? Array.from(fileObject.target.files) : fileObject.files);
    let filteredFiles = (filter ? allFiles.filter(filter) : allFiles);

    if (disallowMultiple && filteredFiles.length > 1) {
      filteredFiles = filteredFiles.slice(0, 1);
    }

    onChange(filteredFiles);
  }, [onChange, multiple, filter]);

  const resetFile = useCallback(() => {
    fileRef.current.value = null;
  }, [fileRef]);

  return (
    <Button component="label" {...buttonProps}>
      {children}
      <input
        type="file"
        ref={fileRef}
        className={classes.fileInput}
        onClick={resetFile}
        onChange={handleFileUpload}
        multiple={(multiple !== false)}
      />
    </Button>
  )
}

FileUpload.propTypes = {
  multiple: PropTypes.bool,
  filterFiles: PropTypes.func,
  buttonProps: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

export default FileUpload;
