import {useSnackbar} from 'notistack';

export const useSnack = () => {
  const {enqueueSnackbar} = useSnackbar();

  return {
    info: (message) => enqueueSnackbar(message),
    warn: (message) => enqueueSnackbar(message, {
      variant: 'warning'
    }),
    error: (message) => enqueueSnackbar(message, {
      variant: 'error'
    }),
  }
}
