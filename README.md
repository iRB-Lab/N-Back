[![Build Status](https://travis-ci.org/iRB-Lab/N-Back.svg)](https://travis-ci.org/iRB-Lab/N-Back)
[![Website](https://img.shields.io/website-up-down-green-red/https/n-back.irockbunnylab.com.svg)](https://n-back.irockbunnylab.com/)
[![License](https://img.shields.io/github/license/iRB-Lab/N-Back.svg)](/blob/master/LICENSE)
[![Say Thanks](https://img.shields.io/badge/Say-Thanks!-1EAEDB.svg)](https://saythanks.io/to/iROCKBUNNY)

[![Watchers](https://img.shields.io/github/watchers/iRB-Lab/N-Back.svg?style=social&label=Watch)](https://github.com/iRB-Lab/N-Back/watchers)
[![Stargazers](https://img.shields.io/github/stars/iRB-Lab/N-Back.svg?style=social&label=Star)](https://github.com/iRB-Lab/N-Back/stargazers)
[![Forks](https://img.shields.io/github/forks/iRB-Lab/N-Back.svg?style=social&label=Fork)](https://github.com/iRB-Lab/N-Back/network)

[![Closed Issues](https://img.shields.io/github/issues-closed/iRB-Lab/N-Back.svg)](https://github.com/iRB-Lab/N-Back/issues)
[![Closed Pull Requests](https://img.shields.io/github/issues-pr-closed/iRB-Lab/N-Back.svg)](https://github.com/iRB-Lab/N-Back/pulls)

# N-Back
A JavaScript implementation of the N-Back Task described in [Hogervorst et al. (2014)][]

## Overview
This task requires participants to indicate each of successively presented letters whether it is a target or not. Workload is low when the target letter is an `X` (0-back), intermediate when the target letter is the same as the one before (1-back) and high when the target letter is the same as two letters before (2-back). In this task, visual input and number of button presses are the same across workload levels. This means that effects of workload can really be attributed to differences in mental processes and cannot be due to different amounts of hand or eye movements in the high workload condition compared to the low workload condition.

## Task
Participants viewed letters, successively presented on a screen. For each letter, they pressed a button to indicate whether the letter was a target or a non-target.

* In the 0-back condition, the letter `X` is the target.
* In the 1-back condition, a letter is a target when it is the same as the one before.
* In the 2-back condition, a letter is a target when it is the same as two letters before.

With this version of the n-back task, the level of workload is varied without varying visual input or frequency and type of motor output (button presses). A 3-back condition was not used, due to evidence that many participants find it too difficult and tend to give up ([Ayaz et al., 2007][]; [Izzetoglu et al., 2007][]).

Participants were informed after every button press whether it was a correct decision by a high (correct) or a low (incorrect) pitched tone. This was intended to help the participant, who in our experiment switched rather often between n-back conditions, and to increase the likelihood that participants would decide to invest effort since the participant knew the experiment leader would hear the sounds as well.

## Stimuli
The letters used in the n-back task were black (font style: Fomantic UI standard, approximately 3 cm high) and were presented on a white background. The letters were presented for 500 ms followed by a 2000-ms inter-stimulus interval during which the letter was replaced by a fixation cross. In all conditions, 33% of letters were targets. Except for the letter `X` in the 0-back task, letters were randomly selected from English consonants. Vowels were excluded to reduce the likeliness of participants developing chunking strategies which reduce mental effort, as suggested in [Grimes et al. (2008)][].

## Design
The three conditions (0-back, 1-back, 2-back) were presented in 2-min blocks divided across four sessions. Each session consisted of two repetitions of each of the three blocks. Thus, for each of the three conditions participants performed `4 sessions * 2 repetitions = 8 blocks`. In each block, 48 letters were presented, 16 of which were targets. The blocks were presented in pseudorandom order, such that each condition was presented once in the first half of the session and once in the second half of the session, and that blocks of the same condition never occurred directly after each other. Before each session was a baseline block of 2 min in which the participant quietly fixated a cross on the screen. With `4 sessions * 2 repetitions * 3 conditions`, plus `4 sessions * 1 baseline block`, the total duration of the n-back task was 56 min.

## Procedure
After entering the lab, participants read and were explained about the experimental procedure. They then signed an informed consent form. The three conditions were practiced up to the point that the participant was familiar with the task. Regardless of this, all participants completed at least one block of the 2-back task in order to also practice the RSME rating that appeared at the end of the block. It was stressed that the 2-back task could be difficult, but that even when the participant thought it was too difficult he or she should keep trying to do as well as possible. Participants were asked to avoid movement as much as possible while performing the task and to use the breaks in between the blocks to make necessary movements. Before the start of each block, the participant was informed about the nature of the block (rest, 0-back, 1-back, or 2-back) via the monitor. After each block, the RSME scale was presented and the participant rated subjective mental effort by clicking the appropriate location on the scale using the mouse. The next block started after the participant indicated to be ready by pressing a button. Between sessions, participants had longer breaks, chatting with the experiment leader or having a drink.

## References
1. [Hogervorst, M. A., Brouwer, A. M., & van Erp, J. B. (2014). Combining and comparing EEG, peripheral physiology and eye-related measures for the assessment of mental workload.][Hogervorst et al. (2014)]

## Powered by
- [Fomantic UI](https://fomantic-ui.com/)
- [jQuery](https://jquery.com/)
- [Lodash](https://lodash.com/)
- [Shields.io](https://shields.io/)
- [Day.js](https://github.com/iamkun/dayjs)
- [jQuery.countdown](https://hilios.github.io/jQuery.countdown/)
- [noUiSlider](https://refreshless.com/nouislider/)
- [clipboard.js](https://clipboardjs.com/)
- [Jekyll](https://jekyllrb.com/)
- [GitHub Pages](https://pages.github.com/)

[Hogervorst et al. (2014)]: https://doi.org/10.3389/fnins.2014.00322 "Hogervorst, M. A., Brouwer, A. M., & van Erp, J. B. (2014). Combining and comparing EEG, peripheral physiology and eye-related measures for the assessment of mental workload."
[Ayaz et al., 2007]: http://ieeexplore.ieee.org/abstract/document/4227285/ "Ayaz, H., Izzetoglu, M., Bunce, S., Heiman-Patterson, T., & Onaral, B. (2007, May). Detecting cognitive activity related hemodynamic signal for brain computer interface using functional near infrared spectroscopy. In Neural Engineering, 2007. CNE'07. 3rd International IEEE/EMBS Conference on (pp. 342-345). IEEE."
[Izzetoglu et al., 2007]: https://idea.library.drexel.edu/islandora/object/idea%3A1880/datastream/OBJ/download/Function_brain_imaging_using_near-infrared_technology_-_assessing_cognitive_activity_in_real-life_situations.pdf "Izzetoglu, M., Bunce, S. C., Izzetoglu, K., Onaral, B., & Pourrezaei, K. (2007). Functional brain imaging using near-infrared technology. IEEE Engineering in Medicine and Biology Magazine, 26(4), 38."
[Grimes et al. (2008)]: http://dl.acm.org/citation.cfm?id=1357187 "Grimes, D., Tan, D. S., Hudson, S. E., Shenoy, P., & Rao, R. P. (2008, April). Feasibility and pragmatics of classifying working memory load with an electroencephalograph. In Proceedings of the SIGCHI Conference on Human Factors in Computing Systems (pp. 835-844). ACM."
