/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useId } from 'react';
import {
  Monitor,
  Smartphone,
  Eye,
  X,
  Code2,
  FileCode,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  DollarSign,
  Users
} from 'lucide-react';

const TIP_OPTIONS = [5, 10, 15, 25, 50];

export default function App() {
  const [bill, setBill] = useState<string>('');
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [customTip, setCustomTip] = useState<string>('');
  const [people, setPeople] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'calculator' | 'standalone' | 'code'>('calculator');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showDesignDiff, setShowDesignDiff] = useState(false);
  const [diffOpacity, setDiffOpacity] = useState(50);
  const [codeFile, setCodeFile] = useState<'html' | 'css' | 'js'>('html');
  const [copiedCode, setCopiedCode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const billInputId = useId();
  const customTipInputId = useId();
  const peopleInputId = useId();

  // Numerical values
  const billValue = parseFloat(bill) || 0;
  const tipPercent = selectedTip !== null ? selectedTip : (parseFloat(customTip) || 0);
  const peopleValue = parseInt(people, 10);
  const hasZeroPeopleError = people !== '' && peopleValue === 0;
  const isPeopleValid = people !== '' && peopleValue > 0;

  // Real-time Calculation
  let tipPerPerson = 0;
  let totalPerPerson = 0;

  if (billValue > 0 && isPeopleValid && tipPercent >= 0) {
    const totalTip = billValue * (tipPercent / 100);
    tipPerPerson = totalTip / peopleValue;
    totalPerPerson = (billValue + totalTip) / peopleValue;
  }

  const isResetEnabled =
    bill.trim() !== '' ||
    people.trim() !== '' ||
    selectedTip !== null ||
    customTip.trim() !== '';

  const handleReset = () => {
    setBill('');
    setSelectedTip(null);
    setCustomTip('');
    setPeople('');
    showToast('Calculator reset');
  };

  const handlePreset = (presetBill: string, presetTip: number, presetPeople: string) => {
    setBill(presetBill);
    setSelectedTip(presetTip);
    setCustomTip('');
    setPeople(presetPeople);
    showToast(`Loaded preset: $${presetBill}, ${presetTip}%, ${presetPeople} people`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleTipClick = (tip: number) => {
    setSelectedTip(tip);
    setCustomTip('');
  };

  const handleCustomTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomTip(val);
    setSelectedTip(null);
  };

  const handleCopyCode = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(true);
      showToast('Code copied to clipboard!');
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      showToast('Copied');
    }
  };

  return (
    <div className="min-h-screen bg-[#c5e4e7] text-[#00474b] flex flex-col justify-between items-center selection:bg-[#26c2ae] selection:text-[#00474b] font-['Space_Mono',monospace]">
      
      {/* Top Reviewer Controls Bar */}
      <header className="w-full max-w-5xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs z-20 bg-white/70 backdrop-blur border-b border-[#00474b]/10">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#00474b] tracking-wider uppercase text-xs flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#26c2ae]" />
            SPLITTER
          </span>
          <span className="text-[#7f9d9f]">/</span>
          <span className="text-[#5e7a7d] hidden sm:inline">Frontend Mentor Tip Calculator</span>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 bg-[#f3f9fa] p-1 rounded-lg border border-[#c5e4e7]">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'calculator'
                ? 'bg-[#00474b] text-[#26c2ae] shadow-sm'
                : 'text-[#5e7a7d] hover:text-[#00474b]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>App</span>
          </button>

          <button
            onClick={() => setActiveTab('standalone')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'standalone'
                ? 'bg-[#00474b] text-[#26c2ae] shadow-sm'
                : 'text-[#5e7a7d] hover:text-[#00474b]'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Pure HTML/CSS</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'bg-[#00474b] text-[#26c2ae] shadow-sm'
                : 'text-[#5e7a7d] hover:text-[#00474b]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Source Code</span>
          </button>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          {activeTab === 'calculator' && (
            <>
              {/* Desktop / Mobile Frame View */}
              <div className="bg-[#f3f9fa] border border-[#c5e4e7] rounded-lg p-0.5 flex items-center">
                <button
                  onClick={() => setDeviceMode('desktop')}
                  className={`p-1.5 rounded-md transition-colors ${
                    deviceMode === 'desktop'
                      ? 'bg-[#00474b] text-[#26c2ae]'
                      : 'text-[#5e7a7d] hover:text-[#00474b]'
                  }`}
                  title="Desktop 1440px view"
                  aria-label="Desktop view"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeviceMode('mobile')}
                  className={`p-1.5 rounded-md transition-colors ${
                    deviceMode === 'mobile'
                      ? 'bg-[#00474b] text-[#26c2ae]'
                      : 'text-[#5e7a7d] hover:text-[#00474b]'
                  }`}
                  title="Mobile 375px frame preview"
                  aria-label="Mobile frame preview"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Design Diff Toggle */}
              <button
                onClick={() => setShowDesignDiff(!showDesignDiff)}
                className={`p-1.5 rounded-lg border transition-colors ${
                  showDesignDiff
                    ? 'bg-[#26c2ae] text-[#00474b] border-[#26c2ae] font-bold'
                    : 'bg-[#f3f9fa] text-[#5e7a7d] border-[#c5e4e7] hover:border-[#7f9d9f]'
                }`}
                title="Design Spec Comparison Diff"
                aria-pressed={showDesignDiff}
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {/* Quick Presets Dropdown */}
          <button
            onClick={() => handlePreset('142.55', 15, '5')}
            className="px-2.5 py-1.5 rounded-lg bg-[#00474b] text-[#26c2ae] font-bold text-xs hover:bg-[#26c2ae] hover:text-[#00474b] transition-colors"
            title="Load design challenge demo values ($142.55, 15%, 5 people)"
          >
            Demo ($142.55)
          </button>
        </div>
      </header>

      {/* Design Diff Comparison Slider */}
      {showDesignDiff && activeTab === 'calculator' && (
        <aside aria-label="Design comparison slider" className="fixed top-14 z-30 bg-white/95 backdrop-blur border border-[#7f9d9f] rounded-lg px-4 py-2 flex items-center gap-3 shadow-xl text-xs">
          <span className="text-[#00474b] font-bold">Design Mockup Match:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={diffOpacity}
            onChange={(e) => setDiffOpacity(Number(e.target.value))}
            className="w-24 sm:w-32 accent-[#26c2ae] cursor-pointer"
            aria-label="Overlay opacity"
          />
          <span className="font-mono text-[#00474b] font-bold">{diffOpacity}%</span>
          <button
            onClick={() => setShowDesignDiff(false)}
            className="text-[#7f9d9f] hover:text-[#00474b] p-0.5 ml-1"
            aria-label="Close diff slider"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col items-center justify-center p-4 sm:p-8">
        
        {/* TAB 1: Live Tip Calculator */}
        {activeTab === 'calculator' && (
          <div
            className={`transition-all duration-300 flex flex-col items-center ${
              deviceMode === 'mobile'
                ? 'w-[375px] max-w-full bg-[#c5e4e7] border-4 border-[#7f9d9f]/70 rounded-[44px] p-4 shadow-2xl relative my-4'
                : 'w-full max-w-[920px]'
            }`}
          >
            {deviceMode === 'mobile' && (
              <div className="w-28 h-4 bg-[#7f9d9f]/50 rounded-full mb-6 mx-auto" />
            )}

            {/* SPLITTER Logo */}
            <div className="mb-10 text-center select-none">
              <img
                src="/images/logo.svg"
                alt="SPLITTER Logo"
                width={87}
                height={54}
                className="mx-auto block"
              />
            </div>

            {/* The Main Calculator Card */}
            <article className="w-full bg-white rounded-3xl p-8 sm:p-10 shadow-[0_32px_48px_rgba(0,71,75,0.08)] grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative overflow-hidden">
              
              {/* Optional Design Comparison Layer */}
              {showDesignDiff && (
                <img
                  src="/tip-calculator-app-main/design/desktop-design-completed.jpg"
                  alt="Original challenge design reference"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
                  style={{ opacity: diffOpacity / 100 }}
                />
              )}

              {/* Left Column: Form Controls */}
              <section aria-label="Bill and tip details" className="flex flex-col justify-between gap-8">
                
                {/* 1. Bill Input */}
                <div className="flex flex-col gap-2">
                  <label htmlFor={billInputId} className="text-base font-bold text-[#5e7a7d]">
                    Bill
                  </label>
                  <div className="relative flex items-center bg-[#f3f9fa] rounded-md border-2 border-transparent focus-within:border-[#26c2ae] transition-colors">
                    <img
                      src="/images/icon-dollar.svg"
                      alt=""
                      aria-hidden="true"
                      className="absolute left-4 w-3 h-4 pointer-events-none"
                    />
                    <input
                      id={billInputId}
                      type="number"
                      placeholder="0"
                      min="0"
                      step="0.01"
                      value={bill}
                      onChange={(e) => setBill(e.target.value)}
                      className="w-full bg-transparent border-none outline-none py-2 px-4 text-right text-2xl font-bold text-[#00474b] placeholder-[#7f9d9f]/60 cursor-pointer"
                    />
                  </div>
                </div>

                {/* 2. Select Tip % */}
                <div className="flex flex-col gap-3">
                  <span className="text-base font-bold text-[#5e7a7d]">
                    Select Tip %
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                    {TIP_OPTIONS.map((tip) => (
                      <button
                        key={tip}
                        type="button"
                        onClick={() => handleTipClick(tip)}
                        className={`tip-btn ${selectedTip === tip ? 'tip-btn-active' : ''}`}
                      >
                        {tip}%
                      </button>
                    ))}
                    <input
                      id={customTipInputId}
                      type="number"
                      placeholder="Custom"
                      min="0"
                      max="1000"
                      value={customTip}
                      onChange={handleCustomTipChange}
                      className={`bg-[#f3f9fa] rounded-md border-2 text-2xl font-bold text-[#00474b] py-1.5 px-3.5 text-right placeholder-[#5e7a7d] outline-none cursor-pointer transition-colors ${
                        selectedTip === null && customTip !== ''
                          ? 'border-[#26c2ae]'
                          : 'border-transparent focus:border-[#26c2ae]'
                      }`}
                      aria-label="Custom tip percentage"
                    />
                  </div>
                </div>

                {/* 3. Number of People Input */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor={peopleInputId} className="text-base font-bold text-[#5e7a7d]">
                      Number of People
                    </label>
                    {hasZeroPeopleError && (
                      <span className="text-sm font-bold text-[#e17457]">
                        Can't be zero
                      </span>
                    )}
                  </div>
                  <div
                    className={`relative flex items-center bg-[#f3f9fa] rounded-md border-2 transition-colors ${
                      hasZeroPeopleError
                        ? 'border-[#e17457]'
                        : 'border-transparent focus-within:border-[#26c2ae]'
                    }`}
                  >
                    <img
                      src="/images/icon-person.svg"
                      alt=""
                      aria-hidden="true"
                      className="absolute left-4 w-3.5 h-4 pointer-events-none"
                    />
                    <input
                      id={peopleInputId}
                      type="number"
                      placeholder="0"
                      min="0"
                      step="1"
                      value={people}
                      onChange={(e) => setPeople(e.target.value)}
                      className="w-full bg-transparent border-none outline-none py-2 px-4 text-right text-2xl font-bold text-[#00474b] placeholder-[#7f9d9f]/60 cursor-pointer"
                    />
                  </div>
                </div>

              </section>

              {/* Right Column: Display & Summary Box */}
              <section aria-label="Calculated results" className="bg-[#00474b] rounded-2xl p-8 sm:p-10 flex flex-col justify-between gap-8">
                
                <div className="flex flex-col gap-8 sm:gap-10">
                  {/* Tip Amount per person */}
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-white text-base font-bold">Tip Amount</span>
                      <span className="text-[#7f9d9f] text-xs font-bold">/ person</span>
                    </div>
                    <div className="text-3xl sm:text-5xl font-bold text-[#26c2ae] tracking-tight truncate">
                      ${tipPerPerson.toFixed(2)}
                    </div>
                  </div>

                  {/* Total per person */}
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-white text-base font-bold">Total</span>
                      <span className="text-[#7f9d9f] text-xs font-bold">/ person</span>
                    </div>
                    <div className="text-3xl sm:text-5xl font-bold text-[#26c2ae] tracking-tight truncate">
                      ${totalPerPerson.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Reset Button */}
                <button
                  type="button"
                  disabled={!isResetEnabled}
                  onClick={handleReset}
                  className="reset-btn mt-6"
                >
                  RESET
                </button>

              </section>

            </article>

            {/* Quick Presets Bar */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-[#5e7a7d]">
              <span className="font-bold">Quick test scenarios:</span>
              <button
                onClick={() => handlePreset('142.55', 15, '5')}
                className="bg-white/80 hover:bg-white text-[#00474b] font-bold px-2.5 py-1 rounded-md shadow-sm transition-colors border border-[#c5e4e7]"
              >
                1. Demo: $142.55 (15% / 5ppl)
              </button>
              <button
                onClick={() => handlePreset('50.00', 10, '2')}
                className="bg-white/80 hover:bg-white text-[#00474b] font-bold px-2.5 py-1 rounded-md shadow-sm transition-colors border border-[#c5e4e7]"
              >
                2. Lunch: $50.00 (10% / 2ppl)
              </button>
              <button
                onClick={() => handlePreset('200.00', 25, '4')}
                className="bg-white/80 hover:bg-white text-[#00474b] font-bold px-2.5 py-1 rounded-md shadow-sm transition-colors border border-[#c5e4e7]"
              >
                3. Dinner: $200.00 (25% / 4ppl)
              </button>
            </div>

          </div>
        )}

        {/* TAB 2: Standalone HTML/CSS/JS Iframe Preview */}
        {activeTab === 'standalone' && (
          <div className="w-full max-w-4xl bg-white border border-[#c5e4e7] rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[740px]">
            <div className="bg-[#00474b] px-4 py-3 border-b border-[#0d686d] flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-green-400 inline-block" />
                </div>
                <span className="font-mono text-[#c5e4e7] ml-2">/tip-calculator-app-main/index.html (Pure HTML, CSS & Vanilla JS)</span>
              </div>
              <a
                href="/tip-calculator/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[#26c2ae] hover:underline font-bold"
              >
                <span>Open in New Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <iframe
              src="/tip-calculator/index.html"
              title="Tip Calculator Pure HTML/CSS Preview"
              className="w-full flex-1 border-0 bg-[#c5e4e7]"
            />
          </div>
        )}

        {/* TAB 3: Source Code Viewer */}
        {activeTab === 'code' && (
          <div className="w-full max-w-3xl bg-white border border-[#c5e4e7] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[720px]">
            <div className="bg-[#00474b] px-4 py-3 border-b border-[#0d686d] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCodeFile('html')}
                  className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-colors ${
                    codeFile === 'html'
                      ? 'bg-[#26c2ae] text-[#00474b]'
                      : 'text-[#c5e4e7] hover:text-white'
                  }`}
                >
                  index.html
                </button>
                <button
                  onClick={() => setCodeFile('css')}
                  className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-colors ${
                    codeFile === 'css'
                      ? 'bg-[#26c2ae] text-[#00474b]'
                      : 'text-[#c5e4e7] hover:text-white'
                  }`}
                >
                  style.css
                </button>
                <button
                  onClick={() => setCodeFile('js')}
                  className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-colors ${
                    codeFile === 'js'
                      ? 'bg-[#26c2ae] text-[#00474b]'
                      : 'text-[#c5e4e7] hover:text-white'
                  }`}
                >
                  script.js
                </button>
              </div>

              <button
                onClick={() => handleCopyCode(SAMPLE_CODE[codeFile])}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#26c2ae] text-[#00474b] font-bold text-xs hover:bg-[#c5e4e7] transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy {codeFile.toUpperCase()}</span>
              </button>
            </div>

            <pre className="p-5 overflow-auto text-xs font-mono text-[#00474b] leading-relaxed bg-[#f3f9fa] flex-1">
              <code>{SAMPLE_CODE[codeFile]}</code>
            </pre>
          </div>
        )}

      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-12 z-50 bg-[#00474b] text-[#26c2ae] border border-[#26c2ae]/40 font-bold text-xs px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2"
        >
          <Check className="w-4 h-4 text-[#26c2ae]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Challenge Attribution Footer */}
      <footer className="w-full text-center py-4 px-4 text-xs text-[#5e7a7d] border-t border-[#00474b]/10 bg-white/40">
        Challenge by{' '}
        <a
          href="https://www.frontendmentor.io?ref=challenge"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#00474b] font-bold hover:underline"
        >
          Frontend Mentor
        </a>
        . Coded with ❤️ by{' '}
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#00474b] font-bold hover:underline"
        >
          Batool Jaweria
        </a>
        .
      </footer>

    </div>
  );
}

const SAMPLE_CODE = {
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Frontend Mentor | Tip calculator app</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@700&display=swap" rel="stylesheet">
</head>
<body>
  <header class="app-header">
    <img src="./images/logo.svg" alt="SPLITTER Logo">
  </header>
  <main>
    <article class="calculator-card">
      <section class="form-section">
        <div class="form-group">
          <label for="bill" class="form-label">Bill</label>
          <div class="input-wrapper">
            <img src="./images/icon-dollar.svg" alt="" class="input-icon">
            <input type="number" id="bill" class="input-field" placeholder="0" min="0" step="0.01">
          </div>
        </div>
        <div class="form-group">
          <span class="form-label">Select Tip %</span>
          <div class="tip-grid">
            <button type="button" class="tip-button" data-tip="5">5%</button>
            <button type="button" class="tip-button" data-tip="10">10%</button>
            <button type="button" class="tip-button" data-tip="15">15%</button>
            <button type="button" class="tip-button" data-tip="25">25%</button>
            <button type="button" class="tip-button" data-tip="50">50%</button>
            <input type="number" id="custom-tip" class="custom-tip-input" placeholder="Custom">
          </div>
        </div>
        <div class="form-group" id="people-group">
          <div class="label-row">
            <label for="people" class="form-label">Number of People</label>
            <span class="error-message">Can't be zero</span>
          </div>
          <div class="input-wrapper">
            <img src="./images/icon-person.svg" alt="" class="input-icon">
            <input type="number" id="people" class="input-field" placeholder="0" min="0" step="1">
          </div>
        </div>
      </section>
      <section class="display-section">
        <div class="result-list">
          <div class="result-item">
            <div>
              <div class="result-title">Tip Amount</div>
              <div class="result-subtitle">/ person</div>
            </div>
            <div class="result-value" id="tip-amount">$0.00</div>
          </div>
          <div class="result-item">
            <div>
              <div class="result-title">Total</div>
              <div class="result-subtitle">/ person</div>
            </div>
            <div class="result-value" id="total-amount">$0.00</div>
          </div>
        </div>
        <button type="button" id="reset-btn" class="reset-button" disabled>RESET</button>
      </section>
    </article>
  </main>
  <script src="script.js"></script>
</body>
</html>`,

  css: `:root {
  --strong-cyan: hsl(172, 67%, 45%);
  --very-dark-cyan: hsl(183, 100%, 15%);
  --dark-grayish-cyan: hsl(186, 14%, 43%);
  --grayish-cyan: hsl(184, 14%, 56%);
  --light-grayish-cyan: hsl(185, 41%, 84%);
  --very-light-grayish-cyan: hsl(189, 47%, 97%);
  --white: hsl(0, 100%, 100%);
  --error: #e17457;
  --font-family: 'Space Mono', monospace;
}

body {
  font-family: var(--font-family);
  background-color: var(--light-grayish-cyan);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.calculator-card {
  background-color: var(--white);
  border-radius: 24px;
  width: 100%;
  max-width: 920px;
  padding: 40px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
}

.input-wrapper {
  position: relative;
  background-color: var(--very-light-grayish-cyan);
  border-radius: 6px;
  border: 2px solid transparent;
}
.input-wrapper:focus-within {
  border-color: var(--strong-cyan);
}
.form-group.has-error .input-wrapper {
  border-color: var(--error) !important;
}

.tip-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.tip-button {
  background-color: var(--very-dark-cyan);
  color: var(--white);
  border: none;
  border-radius: 6px;
  font-size: 24px;
  font-weight: 700;
  padding: 8px 12px;
  cursor: pointer;
}
.tip-button:hover:not(.active) {
  background-color: var(--light-grayish-cyan);
  color: var(--very-dark-cyan);
}
.tip-button.active {
  background-color: var(--strong-cyan);
  color: var(--very-dark-cyan);
}

.display-section {
  background-color: var(--very-dark-cyan);
  border-radius: 16px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.result-value {
  color: var(--strong-cyan);
  font-size: 48px;
  font-weight: 700;
}
.reset-button {
  background-color: var(--strong-cyan);
  color: var(--very-dark-cyan);
  border: none;
  border-radius: 6px;
  font-size: 20px;
  font-weight: 700;
  padding: 12px;
  cursor: pointer;
}
.reset-button:disabled {
  background-color: #0d686d;
  opacity: 0.35;
  cursor: not-allowed;
}`,

  js: `const billInput = document.getElementById('bill');
const peopleInput = document.getElementById('people');
const customTipInput = document.getElementById('custom-tip');
const tipButtons = document.querySelectorAll('.tip-button');
const tipAmountDisplay = document.getElementById('tip-amount');
const totalAmountDisplay = document.getElementById('total-amount');
const resetButton = document.getElementById('reset-btn');
const peopleGroup = document.getElementById('people-group');

let currentTip = 0;

function calculate() {
  const bill = parseFloat(billInput.value) || 0;
  const peopleStr = peopleInput.value.trim();
  const people = parseInt(peopleStr, 10);

  if (peopleStr !== '' && people === 0) {
    peopleGroup.classList.add('has-error');
    tipAmountDisplay.textContent = '$0.00';
    totalAmountDisplay.textContent = '$0.00';
    return;
  } else {
    peopleGroup.classList.remove('has-error');
  }

  if (bill > 0 && people > 0 && currentTip >= 0) {
    const tipTotal = bill * (currentTip / 100);
    tipAmountDisplay.textContent = '$' + (tipTotal / people).toFixed(2);
    totalAmountDisplay.textContent = '$' + ((bill + tipTotal) / people).toFixed(2);
  } else {
    tipAmountDisplay.textContent = '$0.00';
    totalAmountDisplay.textContent = '$0.00';
  }

  resetButton.disabled = !(bill > 0 || peopleStr !== '' || currentTip > 0);
}

tipButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tipButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    customTipInput.value = '';
    currentTip = parseFloat(btn.dataset.tip);
    calculate();
  });
});

customTipInput.addEventListener('input', () => {
  tipButtons.forEach(b => b.classList.remove('active'));
  currentTip = parseFloat(customTipInput.value) || 0;
  calculate();
});

billInput.addEventListener('input', calculate);
peopleInput.addEventListener('input', calculate);
resetButton.addEventListener('click', () => {
  billInput.value = '';
  peopleInput.value = '';
  customTipInput.value = '';
  currentTip = 0;
  tipButtons.forEach(b => b.classList.remove('active'));
  peopleGroup.classList.remove('has-error');
  calculate();
});`
};
