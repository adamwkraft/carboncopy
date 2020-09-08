import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';
import { useCallback, useState, useMemo } from 'react';

import { getMaskName } from '../lib/util';
import { useWebcam } from '../context/webcam';
import { numShippedMasks } from '../lib/constants';

export const useZip = (setMasks) => {
  const webcam = useWebcam();
  const [zipLoading, setZipLoading] = useState(false);

  const loadZippedMasks = useCallback(
    async (file) => {
      const data = await JSZip.loadAsync(file);
      const binaryMasks = await Promise.all(
        data
          .filter((name) => name.endsWith('.png'))
          .map(({ name }) => data.file(name).async('base64')),
      );

      try {
        const masksAsImageData = await Promise.all(
          binaryMasks.map((b64) => webcam.dataUriToImageData(`data:image/png;base64,${b64}`)),
        );
        setMasks(masksAsImageData);
      } catch {}

      setZipLoading(false);
    },
    [setMasks, webcam],
  );

  const handleZipInputChange = useCallback(
    async ([file]) => {
      if (file.type !== 'application/zip') {
        console.error('Expected a zip file but got', file.type);
        return;
      }

      setZipLoading(true);
      await loadZippedMasks(file);
    },
    [loadZippedMasks],
  );

  const handleLoadPreparedMasks = useCallback(
    async (filename) => {
      if (!filename) return;

      setZipLoading(true);
      const file = await new JSZip.external.Promise((resolve, reject) => {
        JSZipUtils.getBinaryContent(process.env.PUBLIC_URL + `/masks/${filename}`, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });

      await loadZippedMasks(file);
    },
    [loadZippedMasks],
  );

  const handleLoadRandomMaskSet = useCallback(async () => {
    const num = Math.floor(Math.random() * numShippedMasks);
    return handleLoadPreparedMasks(getMaskName(num + 1));
  }, [handleLoadPreparedMasks]);

  const data = useMemo(
    () => ({
      loading: zipLoading,
      handleZipInputChange,
      handleLoadRandomMaskSet,
      handleLoadPreparedMasks,
    }),
    [zipLoading, handleZipInputChange, handleLoadPreparedMasks, handleLoadRandomMaskSet],
  );

  return data;
};
