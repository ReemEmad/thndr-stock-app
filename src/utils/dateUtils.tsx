export const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${month} ${day}, ${year}`;
  };