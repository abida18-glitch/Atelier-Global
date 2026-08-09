import React, { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("AtelierStudio ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F9F9F8] text-[#1C1917] flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white border border-[#E6DDD3] p-8 rounded-xl shadow-lg space-y-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7A6B] font-medium">System Interruption</span>
            <h2 className="font-serif text-2xl font-light">An Atelier Exception Occurred</h2>
            <p className="text-xs text-[#8C7A6B] leading-relaxed">
              We encountered an unexpected rendering anomaly in this studio module. Our engineering team has been notified.
            </p>
            {this.state.error && (
              <div className="p-3 bg-[#FAF8F5] border border-[#E6DDD3] rounded text-[11px] font-mono text-left text-red-700 overflow-x-auto">
                {this.state.error.toString()}
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="w-full py-3 bg-[#1C1917] text-[#F9F9F8] text-xs uppercase tracking-[0.15em] rounded hover:bg-[#8C7A6B] transition-colors"
            >
              Reload Atelier Studio
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}