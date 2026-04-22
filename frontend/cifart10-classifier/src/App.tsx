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
import "./App.css";

function App() {
  const [uploadedImage, setUploadedImage] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const uploadImage = useRef<HTMLInputElement>(null);

  function updateImageUrl() {
    const file = uploadImage.current?.files?.[0];
    if (file) {
      setUploadedImage(true);
      //Converts file object to a useable URL
      const imgURL = URL.createObjectURL(file);
      setCurrentImage(imgURL);
    }
  }

  async function predictClass(imgURL: string) {
    const res = await axios.post("/post/predict-type", {
      img_url: imgURL,
    });

    return res.data;
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
              updateImageUrl();
            }}
          ></input>
          {uploadedImage ? (
            <>
              <img
                src={currentImage}
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
          <Button className="w-full">Get Type</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;
