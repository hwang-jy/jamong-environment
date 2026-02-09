import React from "react";

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h2>오류가 발생했습니다.</h2>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
