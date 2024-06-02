class User:
    def __init__(self, total_ticks, good_ticks, currentBadTicks):
        self.total_ticks = total_ticks
        self.good_ticks = good_ticks
        self.bad_ticks = currentBadTicks
        self.good_gazeTicks = 0;
        self.bad_gazeTicks = 0;
        self.total_gazeTicks = 0;
        
    def to_dict(self):
        return {
            'good_ticks': self.good_ticks,
            'bad_ticks': self.bad_ticks,
            'total_ticks': self.total_ticks,
            'percent_good_posture': self.good_ticks / self.total_ticks,
            'percent_good_gaze': self.good_gazeTicks / self.total_gazeTicks
            
        }

        
    def increaseGoodTick(self):
        self.good_ticks += 1
    
    def increaseGoodGazeTick(self):
        self.good_gazeTicks += 1
        
    def increaseTick(self):
        self.total_ticks += 1
        self.total_gazeTicks += 1;
        
    def increaseBadPostureTick(self):
        self.bad_ticks += 1
    
    def increaseBadGazeTick(self):
        self.bad_gazeTicks += 1
        
    def resetBadTicks(self):
        self.bad_ticks = 0
        
    def postureBadForLongTime(self):
        return self.bad_ticks > 30
