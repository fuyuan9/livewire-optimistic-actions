<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Livewire Optimistic Actions Demo</title>
    <link rel="icon" href="data:,">
    @livewireStyles
    <style>
        body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background: radial-gradient(circle at top, #1e293b, #0f172a);
            color: #f8fafc;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 2rem 0;
        }
        .container {
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 2.5rem;
            border-radius: 16px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
            width: 450px;
            text-align: center;
        }
        h2 {
            margin-top: 0;
            color: #38bdf8;
            font-size: 1.75rem;
            font-weight: 800;
            letter-spacing: -0.025em;
        }
        h3 {
            font-size: 1.125rem;
            margin-bottom: 0.75rem;
            color: #e2e8f0;
        }
        button {
            background: #2563eb;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.2s;
            margin: 0.5rem;
            box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
        }
        button:hover {
            background: #1d4ed8;
            transform: translateY(-1px);
        }
        button:active {
            transform: translateY(0);
        }
        button.unlike {
            background: #dc2626;
            box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.2);
        }
        button.unlike:hover {
            background: #b91c1c;
        }
        .counter {
            font-size: 3rem;
            font-weight: 800;
            margin: 1rem 0;
            color: #38bdf8;
            text-shadow: 0 0 10px rgba(56, 189, 248, 0.2);
        }
        .status-badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 700;
            background: #475569;
            color: #cbd5e1;
            text-transform: uppercase;
        }
        .status-badge.published {
            background: #166534;
            color: #bbf7d0;
            box-shadow: 0 0 10px rgba(22, 101, 52, 0.2);
        }
        .pending {
            color: #fbbf24;
            font-weight: 600;
            font-size: 0.875rem;
            margin-top: 0.5rem;
            animation: pulse 1.5s infinite;
        }
        .failed {
            color: #f87171;
            font-weight: 600;
            font-size: 0.875rem;
            margin-top: 0.5rem;
        }
        .todo-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(51, 65, 85, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.05);
            padding: 0.75rem 1rem;
            border-radius: 8px;
            margin: 0.5rem 0;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: .5; }
        }
    </style>
</head>
<body>
    {{ $slot }}

    @livewireScripts
    @livewireOptimisticActions
</body>
</html>
