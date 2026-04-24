import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import axios from "axios";

import { Pie, PieChart } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
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
  const [predictions, setPredictions] = useState<object>({ true: 0, false: 0 });

  const [openState, setOpenState] = useState(false);
  const [classHighest, setClassHighest] = useState<string>("");
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

  const chartData = [
    { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  ];

  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    chrome: {
      label: "Correct",
      color: "#22c55e",
    },
    safari: {
      label: "Incorrect",
      color: "#ef4444",
    },
  } satisfies ChartConfig;

  // Gets the image from local
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

  // Server Functions
  // Post
  async function insertRow(predictedClass: string, isCorrect: boolean) {
    const res = await axios.post("/post/insert-data", {
      predictedClass: predictedClass,
      isCorrect: isCorrect,
    });
    return res.data;
  }

  async function predictClass(img: File) {
    const formData = new FormData();
    formData.append("image", img);
    const res = await axios.post("/post/predict-type", formData);

    return res.data;
  }

  // Get
  async function getNoOfPredictions() {
    const res = await axios.get("/get/fetchData");

    const current = res.data.db;
    console.log(current.false);
  }
  // Gets the highest value among 10 classes
  function getHighestPrediction(arr: number[]) {
    const maxIndex = arr.indexOf(Math.max(...arr));
    return CIFAR_CLASSES[maxIndex];
  }

  return (
    <div className="flex gap-30 items-center justify-center h-screen bg-black bg-[radial-gradient(ellipse_100%_60%_at_50%_100%,rgba(255,255,255,0.12),transparent_70%)]">
      {/* Chart Card */}
      <Card className="flex flex-col w-full max-w-sm">
        <CardHeader className="items-center pb-0">
          <CardTitle>Pie Chart - Legend</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent nameKey="browser" hideLabel />}
              />
              <Pie data={chartData} dataKey="visitors" />
              <ChartLegend
                content={<ChartLegendContent nameKey="browser" />}
                className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
      {/* Predict Class Card */}
      <Card className="relative w-full max-w-sm pt-0">
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
            Upload an image from one of ten categories
            <span className="font-semibold italic">
              {" "}
              (airplane, automobile, bird, cat, deer, dog, frog, horse, ship, or
              truck){" "}
            </span>
            and the CIFAR-10 model will attempt to classify it.
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
                setClassHighest(class_highest);
                setOpenState(true);
              }
            }}
            disabled={!uploadedImage}
          >
            Get Type
          </Button>
        </CardFooter>
      </Card>

      {/* Alert Dialog showing which class has the highest probability */}
      <AlertDialog open={openState}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader className="items-center">
            <AlertDialogTitle className="text-center">
              The model predicted:
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-2xl font-bold text-foreground py-1 capitalize">
              {classHighest}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-red-600 text-white border-red-600 hover:bg-red-700 hover:text-white hover:border-red-700 dark:bg-red-700 dark:text-white dark:border-red-700 dark:hover:bg-red-800 dark:hover:text-white dark:hover:border-red-800"
              onClick={async () => {
                insertRow(classHighest, false);
                setOpenState(false);
                getNoOfPredictions();
              }}
            >
              No, incorrect
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
              onClick={async () => {
                insertRow(classHighest, true);
                setOpenState(false);
              }}
            >
              Yes, correct
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default App;
