
import React from "react";
import Chat from "@/components/Chat";
import { APP_NAME } from "@/config/constants";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-lanka-light to-blue-50">
      <header className="bg-lanka-blue text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="font-bold text-lg sm:text-xl md:text-2xl flex items-center gap-2">
            <span className="text-lanka-gold">&#9733;</span>
            {APP_NAME}
          </h1>
          <div className="text-xs md:text-sm bg-lanka-gold/20 px-3 py-1 rounded-full text-lanka-gold font-medium">
            Sri Lankan Education Counselor
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6 max-w-4xl">
        <div className="h-[calc(100vh-12rem)] bg-white/30 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-white/50">
          <Chat />
        </div>
      </main>

      <footer className="bg-white/50 backdrop-blur-sm py-3 text-center text-sm text-lanka-blue/70 border-t border-lanka-blue/10">
        <div className="container mx-auto">
          <p>{APP_NAME} &copy; {new Date().getFullYear()} | Educational Assistant for Sri Lanka</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
