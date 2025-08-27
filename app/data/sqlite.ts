import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';

const db = new Database('dashboard.db');

db.prepare(`
    DELETE FROM users_dashboards
`).run();

//users table
db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        email TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
`).run();

//dashboards table
db.prepare(`
    CREATE TABLE IF NOT EXISTS dashboards (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT
    )
`).run();

//users_dashboards table
db.prepare(`
    CREATE TABLE IF NOT EXISTS users_dashboards (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        dashboard_id TEXT NOT NULL
    )
`).run();


//seed basic dashboards
db.prepare(`
    INSERT OR IGNORE INTO dashboards (id, name, description)
    VALUES ('Weather', 'Weather Monitor', 'A dashboard to monitor the weather')
`).run();

db.prepare(`
    INSERT OR IGNORE INTO dashboards (id, name, description)
    VALUES ('Fitness', 'Fitness Tracker', 'Monitor daily and weekly fitness goals.')
`).run();

db.prepare(`
    INSERT OR IGNORE INTO dashboards (id, name, description)
    VALUES ('Finance', 'Financial Tracker', 'Monitor financial savings and expenses.')
`).run();

db.prepare(`
    INSERT OR IGNORE INTO dashboards (id, name, description)
    VALUES ('BibleStudy', 'Bible Study Plan', 'Create, plan and track your Bible study goals!')
`).run();

db.prepare(`
    INSERT OR IGNORE INTO dashboards (id, name, description)
    VALUES ('Tasks', 'Task Manager', 'Create and execute tasks throughout the day or week!')
`).run();

db.prepare(`
    INSERT OR IGNORE INTO users (id, username, email)
    VALUES ('1', 'John Doe', 'john.doe@example.com')
`).run();

//get all dashboards
const usersDashboards = (userId: string) => {
    if (!userId) throw new Error('User ID not provided.');

    const user = db.prepare(`
        SELECT * FROM users WHERE id = :userId
    `).get({ userId });

    if (!user) throw new Error('User not found.');

    const dashboards = db.prepare(`
        SELECT * FROM users_dashboards WHERE user_id = ?
    `).all(userId);

    return dashboards.map((dashboard: any) => {
        return db.prepare(`
            SELECT * FROM dashboards WHERE id = ?
        `).get(dashboard.dashboard_id);
    });
}

const addDashboard = (userId: string, dashboardId: string) => {
    if (!userId || !dashboardId) throw new Error('User ID and dashboard ID are required.');

    const user = db.prepare(`
        SELECT * FROM users WHERE id = ?
    `).get(userId);

    if (!user) throw new Error('User not found.');

    const dashboard = db.prepare(`
        SELECT * FROM dashboards WHERE id = ?
    `).get(dashboardId);

    if (!dashboard) throw new Error('Dashboard not found.');

    const existingDashboard = db.prepare(`
        SELECT * FROM users_dashboards WHERE user_id = ? AND dashboard_id = ?
    `).get(userId, dashboardId);

    if (existingDashboard) throw new Error('Dashboard already exists for this user.');

    db.prepare(`
        INSERT OR IGNORE INTO users_dashboards (id, user_id, dashboard_id)
        VALUES (?, ?, ?)
    `).run(uuidv4(), userId, dashboardId);
}

const removeDashboard = (userId: string, dashboardId: string) => {
    if (!userId || !dashboardId) throw new Error('User ID and dashboard ID are required.');

    const user = db.prepare(`
        SELECT * FROM users WHERE id = ?
    `).get(userId);

    if (!user) throw new Error('User not found.');

    const dashboard = db.prepare(`
        SELECT * FROM dashboards WHERE id = ?
    `).get(dashboardId);

    if (!dashboard) throw new Error('Dashboard not found.');

    db.prepare(`
        DELETE FROM users_dashboards WHERE user_id = ? AND dashboard_id = ?
    `).run(userId, dashboardId);
}

