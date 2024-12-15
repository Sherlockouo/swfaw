import React, { useState } from "react";
import { Button, Card, CardBody, Progress, Spacer } from "@nextui-org/react";
import { check, Update } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

const CheckUpdate: React.FC = () => {
  const [updateAvailable, setUpdateAvailable] = useState<Update | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [contetLength, setContetLength] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleCheckUpdate = async () => {
    setIsChecking(true);
    setError(null);
    try {
      const update = await check();
      if (update) {
        setUpdateAvailable(update);
        console.log("update", update);
        console.log(
          `Found update ${update.version} from ${update.date} with notes: ${update.body}`,
        );
      } else {
        setUpdateAvailable(null);
        console.log("No updates available.");
      }
    } catch (err) {
      console.error("Error checking for updates:", err);
      setError("Failed to check for updates.");
    } finally {
      setIsChecking(false);
    }
  };

  const handleDownloadAndInstall = async () => {
    if (!updateAvailable) return;

    setIsDownloading(true);
    setError(null);
    try {
      await updateAvailable.downloadAndInstall((event) => {
        switch (event.event) {
          case "Started":
            console.log(
              `Started downloading ${event.data.contentLength} bytes`,
            );
            setContetLength(event.data.contentLength || 0);
            break;
          case "Progress":
            const progress = (event.data.chunkLength / contetLength) * 100;
            setDownloadProgress(progress);
            console.log(`Downloaded ${downloadProgress}%`);
            break;
          case "Finished":
            console.log("Download finished");
            break;
          default:
            break;
        }
      });
      console.log("Update installed");
      await relaunch();
    } catch (err) {
      console.error("Error downloading/installing update:", err);
      setError("Failed to download or install the update.");
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  return (
    <Card>
      <CardBody>
        <h2>Check for Updates</h2>
        <Spacer y={1} />
        <Button
          onClick={handleCheckUpdate}
          disabled={isChecking || isDownloading}
        >
          {isChecking ? <Spacer></Spacer> : "Check for Updates"}
        </Button>
        {updateAvailable && (
          <>
            <Spacer y={1} />
            <h2>
              <strong>New Version:</strong> {updateAvailable.version}
            </h2>
            <h2>
              <strong>Release Date:</strong>{" "}
              {/* {new Date(updateAvailable.date).toLocaleDateString()} */}
            </h2>
            <h2>
              <strong>Release Notes:</strong> {updateAvailable.body}
            </h2>
            <Spacer y={1} />
            <Button
              color="success"
              onClick={handleDownloadAndInstall}
              disabled={isDownloading}
            >
              {isDownloading ? <Spacer></Spacer> : "Download and Install"}
            </Button>
            {isDownloading && (
              <Progress value={downloadProgress} color="primary" />
            )}
          </>
        )}
        {!isChecking && !updateAvailable && <Spacer y={1} />}
        {error && (
          <>
            <Spacer y={1} />
            <h2 color="error">{error}</h2>
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default CheckUpdate;
