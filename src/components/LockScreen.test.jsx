import React from "react";
import { mount } from "enzyme";
import LockScreen from "./LockScreen";
import ClockDisplay from "./ClockDisplay";
import SlideToUnlock from "./SlideToUnlock";
import TopOverlay from "./TopOverlay";

describe("LockScreen", () => {
  //BEGIN SETUP
  //create let bindings to make these available
  //to everything inside describe
  let props;
  let mountedLockScreen;

  //create lockscreen fn available anywhere inside describe
  const lockScreen = () => {
    if (!mountedLockScreen) {
      //either mount lockscreen with current props,
      //or return the already mounted one
      mountedLockScreen = mount(<LockScreen {...props} />);
    }
    //returns enzyme reactwrapper
    //to be used in every test
    return mountedLockScreen;
  };

  //resets props and mountedlockscreen before every test
  // to prevent state leakage between tests
  beforeEach(() => {
    props = {
      wallpaperPath: undefined,
      userInfoMessage: undefined,
      onUnlocked: undefined
    };
    //setting mLS to undefined mounts a new
    //lockscreen with current props
    mountedLockScreen = undefined;
  });
  //this setup keeps tests DRY by building up props incrementally,
  // before mounting
  //FINISH SETUP

  it("always renders a div", () => {
    const divs = lockScreen().find("div");
    expect(divs.length).toBeGreaterThan(0);
  });

  describe("the rendered div", () => {
    it("contains everything else that gets rendered", () => {
      const divs = lockScreen().find("div");
      // When using .find, enzyme arranges the nodes in order such
      // that the outermost node is first in the list. So we can
      // use .first() to get the outermost div.
      const wrappingDiv = divs.first();

      // Enzyme omits the outermost node when using the .children()
      // method on lockScreen(). This is annoying, but we can use it
      // to verify that wrappingDiv contains everything else this
      // component renders.
      expect(wrappingDiv.children()).toEqual(lockScreen().children());
    });
  });

  //"ALWAYS" true tests
  it("always renders a `ClockDisplay`", () => {
    expect(lockScreen().find(ClockDisplay).length).toBe(1);
  });

  describe("rendered `ClockDisplay`", () => {
    it("does not receive any props", () => {
      const clockDisplay = lockScreen().find(ClockDisplay);
      expect(Object.keys(clockDisplay.props()).length).toBe(0);
    });
  });

  it("always renders a `SlideToUnlock`", () => {
    expect(lockScreen().find(SlideToUnlock).length).toBe(1);
  });

  //"CONDITIONALLY" true tests
  //when testing conditionals, describe('the condition')
  //then use beforeEach() to set up condition within describe
  //it('does the action correctly based on the condition')

  describe("when `onUnlocked` is defined", () => {
    beforeEach(() => {
      props.onUnlocked = jest.fn();
    });

    it("sets the rendered `SlideToUnlock`'s `onSlide` prop to the same value as `onUnlocked`'", () => {
      const slideToUnlock = lockScreen().find(SlideToUnlock);
      expect(slideToUnlock.props().onSlide).toBe(props.onUnlocked);
    });
  });

  describe("when `onUnlocked` is undefined", () => {
    beforeEach(() => {
      props.onUnlocked = undefined;
    });

    it("sets the rendered `SlideToUnlock`'s `onSlide` prop to undefined'", () => {
      const slideToUnlock = lockScreen().find(SlideToUnlock);
      expect(slideToUnlock.props().onSlide).not.toBeDefined();
    });
  });

  describe("when `wallpaperPath` is passed", () => {
    beforeEach(() => {
      props.wallpaperPath = "some/image.png";
    });

    it("applies that wallpaper as a background-image on the wrapping div", () => {
      const wrappingDiv = lockScreen()
        .find("div")
        .first();
      expect(wrappingDiv.props().style.backgroundImage).toBe(
        `url(${props.wallpaperPath})`
      );
    });
  });

  describe("when `userInfoMessage` is passed", () => {
    beforeEach(() => {
      props.userInfoMessage = "This is my favorite phone!";
    });

    it("renders a `TopOverlay`", () => {
      expect(lockScreen().find(TopOverlay).length).toBe(1);
    });

    it("passes `userInfoMessage` to the rendered `TopOverlay` as `children`", () => {
      const topOverlay = lockScreen().find(TopOverlay);
      expect(topOverlay.props().children).toBe(props.userInfoMessage);
    });
  });

  describe("when `userInfoMessage` is undefined", () => {
    beforeEach(() => {
      props.userInfoMessage = undefined;
    });

    it("does not render a `TopOverlay`", () => {
      expect(lockScreen().find(TopOverlay).length).toBe(0);
    });
  });
});
