<?php

class <%= baseClassName %>TestCase extends TestCase
{
    public function setUp()
    {
        parent::setUp();
    }

    /**
     * Test the constructor
     *
     * @test
     * @covers ::__construct
     */
    public function testConstruct()
    {
        $this->assertEquals(true, true);
    }
}
