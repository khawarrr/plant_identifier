import PlantIdentifier from "./components/PlantIdentifier";
import {
  ArrowUpTrayIcon,
  SparklesIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-700">
        Welcome to Plant Identifier
      </h1>
      <p className="mb-8 text-center">
        Upload an image of a plant and our AI will identify it for you!
      </p>
      <PlantIdentifier />

      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-8 text-center text-white">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: ArrowUpTrayIcon,
              title: "Upload Image",
              description:
                "Take a photo or upload an existing image of a plant you want to identify.",
            },
            {
              icon: SparklesIcon,
              title: "AI Analysis",
              description:
                "Our advanced AI analyzes the image to identify the plant species.",
            },
            {
              icon: InformationCircleIcon,
              title: "Get Information",
              description:
                "Receive detailed information about the plant, including its name, scientific name, and characteristics.",
            },
          ].map((step, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-6 flex flex-col items-center text-center"
            >
              <div className="bg-green-400 rounded-full p-3 mb-4">
                <step.icon className="h-6 w-6 text-gray-800" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">
                {step.title}
              </h3>
              <p className="text-gray-300 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
