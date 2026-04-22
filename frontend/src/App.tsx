import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import axios from "axios";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import "./App.css";

function App() {
  const [uploadedImage, setUploadedImage] = useState(false);
  const [currentImage, setCurrentImage] = useState<File | null>(null);
  const [selectedImageURL, setselectedImageURL] = useState<string>("");
  const [openState, setOpenState] = useState(false);
  const uploadImage = useRef<HTMLInputElement>(null);

  const CIFAR_CLASSES = [
    "airplane",
    "automobile",
    "bird",
    "cat",
    "deer",
    "dog",
    "frog",
    "horse",
    "ship",
    "truck",
  ];

  function updateImage() {
    const file = uploadImage.current?.files?.[0];
    if (file) {
      setUploadedImage(true);
      setCurrentImage(file);
      if (selectedImageURL) {
        URL.revokeObjectURL(selectedImageURL);
      }
      setselectedImageURL(URL.createObjectURL(file));
    }
  }

  async function predictClass(img: File) {
    const formData = new FormData();
    formData.append("image", img);
    const res = await axios.post("/post/predict-type", formData);

    return res.data;
  }

  function getHighestPrediction(arr: number[]) {
    const maxIndex = arr.indexOf(Math.max(...arr));
    return CIFAR_CLASSES[maxIndex];
  }

  return (
    <div className="flex items-center justify-center h-screen bg-black bg-[radial-gradient(ellipse_100%_60%_at_50%_100%,rgba(255,255,255,0.12),transparent_70%)]">
      <Card className="relative mx-auto w-full max-w-sm pt-0">
        <div
          className="relative z-20 flex aspect-video w-full items-center justify-center rounded-lg hover:cursor-pointer bg-muted/40 transition duration-200 hover:bg-muted/100 text-muted-foreground"
          onClick={() => {
            uploadImage.current?.click();
          }}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={uploadImage}
            onChange={() => {
              updateImage();
            }}
          ></input>
          {uploadedImage ? (
            <>
              <img
                src={selectedImageURL}
                alt="Event cover"
                className="absolute z-20 aspect-video w-full object-cover brightness-90"
              />
              <div className="absolute inset-0 z-30 bg-white/30 backdrop-blur-[1px] flex items-center justify-center opacity-0 hover:opacity-100 transition duration-300">
                <Plus className="h-8 w-8 text-slate-600" />
              </div>
            </>
          ) : (
            <Plus className="h-8 w-8" />
          )}
        </div>
        <CardHeader className="flex flex-col items-center">
          <CardTitle>Cifar-10 Classifier</CardTitle>
          <CardDescription className="text-center">
            Upload an image from your device and the CIFAR-10 model will
            classify it into one of ten categories: airplane, automobile, bird,
            cat, deer, dog, frog, horse, ship, or truck.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            className="w-full"
            onClick={async () => {
              if (currentImage) {
                const classPredictions = await predictClass(currentImage);
                const class_highest = getHighestPrediction(
                  classPredictions.prediction[0],
                );
                console.log(class_highest);
              }
            }}
            disabled={!uploadedImage}
          >
            Get Type
          </Button>
        </CardFooter>
      </Card>

      {/* Alert Dialog showing which class has the highest probability */}
      {/* <AlertDialog open={true}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </div>
  );
}

export default App;
