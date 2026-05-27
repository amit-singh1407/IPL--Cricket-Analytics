from __future__ import annotations

from apscheduler.schedulers.background import BackgroundScheduler


class ScrapeScheduler:
    def __init__(self, scraper, urls: list[str], interval_minutes: int = 360):
        self.scraper = scraper
        self.urls = urls
        self.interval_minutes = interval_minutes
        self.scheduler = BackgroundScheduler(daemon=True)

    def start(self):
        if not self.scheduler.get_jobs():
            self.scheduler.add_job(
                self.scraper.scrape_and_store,
                "interval",
                minutes=self.interval_minutes,
                args=[self.urls],
                id="ipl_scorecard_scrape",
                replace_existing=True,
            )
            self.scheduler.start()
        return self.scheduler

    def shutdown(self):
        if self.scheduler.running:
            self.scheduler.shutdown(wait=False)
